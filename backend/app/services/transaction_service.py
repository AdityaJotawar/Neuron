"""Transaction service handling business logic for transactions."""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.account import Account
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.utils.exceptions import DatabaseError, ResourceNotFoundError, ValidationError


class TransactionService:
    """Service class for transaction operations."""

    async def get_all_transactions(
        self,
        session: AsyncSession,
        user_id: str,
        account_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        category: Optional[str] = None,
    ) -> List[Transaction]:
        """Get all transactions for a user with optional filtering."""
        stmt = select(Transaction).where(Transaction.user_id == user_id)

        if account_id:
            stmt = stmt.where(Transaction.account_id == account_id)
        if start_date:
            stmt = stmt.where(Transaction.date >= start_date)
        if end_date:
            stmt = stmt.where(Transaction.date <= end_date)
        if category:
            stmt = stmt.where(Transaction.category == category)

        stmt = stmt.order_by(Transaction.date.desc())
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def get_transaction_by_id(
        self, session: AsyncSession, transaction_id: str, user_id: str
    ) -> Transaction:
        """Get a transaction by ID and user ID."""
        stmt = select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == user_id
        )
        result = await session.execute(stmt)
        tx = result.scalars().first()
        if not tx:
            raise ResourceNotFoundError("Transaction", transaction_id)
        return tx

    async def _validate_account_exists(
        self, session: AsyncSession, account_id: str, user_id: str
    ) -> None:
        """Validate that an account exists for the user."""
        stmt = select(Account.id).where(
            Account.id == account_id, Account.user_id == user_id
        )
        result = await session.execute(stmt)
        if not result.scalars().first():
            raise ValidationError(f"Account with id '{account_id}' does not exist")

    async def create_transaction(
        self,
        session: AsyncSession,
        transaction_create: TransactionCreate,
        user_id: str,
    ) -> Transaction:
        """Create a new transaction after validating account exists."""
        await self._validate_account_exists(
            session, transaction_create.account_id, user_id
        )

        data = transaction_create.model_dump()
        tx = Transaction(id=str(uuid4()), user_id=user_id, **data)
        session.add(tx)
        try:
            await session.commit()
            await session.refresh(tx)
            return tx
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to create transaction: {e}")

    async def update_transaction(
        self,
        session: AsyncSession,
        transaction_id: str,
        transaction_update: TransactionUpdate,
        user_id: str,
    ) -> Transaction:
        """Update an existing transaction."""
        tx = await self.get_transaction_by_id(session, transaction_id, user_id)

        update_data = transaction_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tx, key, value)

        tx.updated_at = datetime.utcnow()
        session.add(tx)
        try:
            await session.commit()
            await session.refresh(tx)
            return tx
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to update transaction: {e}")

    async def delete_transaction(
        self, session: AsyncSession, transaction_id: str, user_id: str
    ) -> None:
        """Delete a transaction."""
        tx = await self.get_transaction_by_id(session, transaction_id, user_id)
        try:
            await session.delete(tx)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to delete transaction: {e}")

    async def create_bulk_transactions(
        self,
        session: AsyncSession,
        transactions_create: List[TransactionCreate],
        user_id: str,
    ) -> List[Transaction]:
        """Create multiple transactions in bulk after validating all accounts."""
        if not transactions_create:
            return []

        # Gather unique account IDs and validate all at once
        account_ids = {t.account_id for t in transactions_create}
        stmt = select(Account.id).where(
            Account.id.in_(account_ids), Account.user_id == user_id
        )
        result = await session.execute(stmt)
        valid_account_ids = set(result.scalars().all())

        for acc_id in account_ids:
            if acc_id not in valid_account_ids:
                raise ValidationError(f"Account with id '{acc_id}' does not exist")

        created_txs = []
        for t_create in transactions_create:
            data = t_create.model_dump()
            tx = Transaction(id=str(uuid4()), user_id=user_id, **data)
            session.add(tx)
            created_txs.append(tx)

        try:
            await session.commit()
            for tx in created_txs:
                await session.refresh(tx)
            return created_txs
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to create bulk transactions: {e}")

    async def delete_bulk_transactions(
        self, session: AsyncSession, transaction_ids: List[str], user_id: str
    ) -> None:
        """Delete multiple transactions in bulk."""
        if not transaction_ids:
            return

        stmt = delete(Transaction).where(
            Transaction.id.in_(transaction_ids), Transaction.user_id == user_id
        )
        try:
            await session.execute(stmt)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to delete bulk transactions: {e}")
