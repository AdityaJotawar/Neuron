"""Import service handling CSV uploads, validation, persistence, and history tracking."""

import csv
from datetime import datetime
import io
from typing import List, Optional
from uuid import uuid4

from pydantic import ValidationError as PydanticValidationError
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.account import Account
from app.models.import_history import ImportHistory
from app.models.stock_holding import StockHolding
from app.models.transaction import Transaction
from app.schemas.account import AccountCreate
from app.schemas.import_history import ImportHistoryResponse
from app.schemas.stock_holding import StockHoldingCreate
from app.schemas.transaction import TransactionCreate
from app.utils.exceptions import DatabaseError, FileTooLargeError, ResourceNotFoundError


class ImportService:
    """Service class for CSV import operations."""

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    async def get_all_imports(
        self, session: AsyncSession, user_id: str
    ) -> List[ImportHistoryResponse]:
        """Get all import history records for a user ordered by uploaded_at descending."""
        stmt = (
            select(ImportHistory)
            .where(ImportHistory.user_id == user_id)
            .order_by(ImportHistory.uploaded_at.desc())
        )
        result = await session.execute(stmt)
        records = result.scalars().all()
        return [ImportHistoryResponse.model_validate(r) for r in records]

    async def delete_import_with_cascade(
        self, session: AsyncSession, import_id: str, user_id: str
    ) -> None:
        """Delete an import history record and atomically cascade delete all imported entities."""
        stmt = select(ImportHistory).where(
            ImportHistory.id == import_id, ImportHistory.user_id == user_id
        )
        result = await session.execute(stmt)
        ih = result.scalars().first()
        if not ih:
            raise ResourceNotFoundError("ImportHistory", import_id)

        try:
            if ih.file_type == "transactions":
                await session.execute(
                    delete(Transaction).where(Transaction.import_id == import_id)
                )
            elif ih.file_type == "stock_holdings":
                await session.execute(
                    delete(StockHolding).where(StockHolding.import_id == import_id)
                )
            elif ih.file_type == "accounts":
                await session.execute(
                    delete(Account).where(Account.import_id == import_id)
                )

            await session.delete(ih)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to delete import with cascade: {e}")

    async def upload_csv(
        self,
        session: AsyncSession,
        file_content: bytes,
        file_name: str,
        file_type: str,
        user_id: str,
        account_id: Optional[str] = None,
    ) -> ImportHistoryResponse:
        """Process and persist CSV upload with full validation and tracking."""
        if len(file_content) > self.MAX_FILE_SIZE:
            raise FileTooLargeError(10)

        # Fetch account name if account_id is provided
        account_name = None
        if account_id:
            acc_stmt = select(Account).where(
                Account.id == account_id, Account.user_id == user_id
            )
            acc_res = await session.execute(acc_stmt)
            acc = acc_res.scalars().first()
            if acc:
                account_name = acc.name

        # Create ImportHistory record in processing state
        ih = ImportHistory(
            id=str(uuid4()),
            user_id=user_id,
            file_name=file_name,
            file_type=file_type,
            status="processing",
            account_id=account_id,
            account_name=account_name,
        )
        session.add(ih)
        await session.commit()
        await session.refresh(ih)

        total_rows = 0
        successful_rows = 0
        failed_rows = 0
        errors = []

        try:
            csv_text = file_content.decode("utf-8", errors="replace")
            reader = csv.DictReader(io.StringIO(csv_text))

            for r_idx, row in enumerate(reader, start=1):
                total_rows += 1
                clean_row = {k.strip(): v.strip() for k, v in row.items() if k and v}

                # Inject account_id if applicable
                if account_id and "account_id" not in clean_row:
                    clean_row["account_id"] = account_id

                try:
                    if file_type == "transactions":
                        schema_obj = TransactionCreate(**clean_row)
                        entity = Transaction(
                            id=str(uuid4()),
                            user_id=user_id,
                            import_id=ih.id,
                            **schema_obj.model_dump(),
                        )
                    elif file_type == "stock_holdings":
                        schema_obj = StockHoldingCreate(**clean_row)
                        entity = StockHolding(
                            id=str(uuid4()),
                            user_id=user_id,
                            import_id=ih.id,
                            last_price_update=datetime.utcnow(),
                            **schema_obj.model_dump(),
                        )
                    elif file_type == "accounts":
                        schema_obj = AccountCreate(**clean_row)
                        entity = Account(
                            id=str(uuid4()),
                            user_id=user_id,
                            import_id=ih.id,
                            **schema_obj.model_dump(),
                        )
                    else:
                        raise ValueError(f"Unsupported file type: {file_type}")

                    session.add(entity)
                    successful_rows += 1

                except (PydanticValidationError, ValueError) as ve:
                    failed_rows += 1
                    errors.append(f"Row {r_idx}: {str(ve)}")

            await session.commit()

            ih.total_rows = total_rows
            ih.successful_rows = successful_rows
            ih.failed_rows = failed_rows
            ih.completed_at = datetime.utcnow()

            if total_rows == 0 or (failed_rows > 0 and successful_rows == 0):
                ih.status = "failed"
                ih.error_message = "; ".join(errors[:10])  # store first 10 errors
            else:
                ih.status = "completed"
                if errors:
                    ih.error_message = "; ".join(errors[:10])

            session.add(ih)
            await session.commit()
            await session.refresh(ih)

        except Exception as e:
            await session.rollback()
            ih.status = "failed"
            ih.error_message = f"CSV parsing error: {e}"
            ih.completed_at = datetime.utcnow()
            session.add(ih)
            await session.commit()
            await session.refresh(ih)

        return ImportHistoryResponse.model_validate(ih)
