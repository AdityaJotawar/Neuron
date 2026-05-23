"""Account service handling business logic for accounts."""

from datetime import datetime
from typing import List
from uuid import uuid4

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.account import Account
from app.models.stock_holding import StockHolding
from app.models.transaction import Transaction
from app.schemas.account import AccountCreate, AccountUpdate
from app.utils.exceptions import DatabaseError, ResourceNotFoundError


class AccountService:
    """Service class for account operations."""

    async def get_all_accounts(
        self, session: AsyncSession, user_id: str
    ) -> List[Account]:
        """Get all accounts for a user, ordered by created_at descending."""
        stmt = (
            select(Account)
            .where(Account.user_id == user_id)
            .order_by(Account.created_at.desc())
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def get_account_by_id(
        self, session: AsyncSession, account_id: str, user_id: str
    ) -> Account:
        """Get an account by ID and user ID."""
        stmt = select(Account).where(
            Account.id == account_id, Account.user_id == user_id
        )
        result = await session.execute(stmt)
        account = result.scalars().first()
        if not account:
            raise ResourceNotFoundError("Account", account_id)
        return account

    async def create_account(
        self, session: AsyncSession, account_create: AccountCreate, user_id: str
    ) -> Account:
        """Create a new account."""
        data = account_create.model_dump()
        account = Account(id=str(uuid4()), user_id=user_id, **data)
        session.add(account)
        try:
            await session.commit()
            await session.refresh(account)
            return account
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to create account: {e}")

    async def update_account(
        self,
        session: AsyncSession,
        account_id: str,
        account_update: AccountUpdate,
        user_id: str,
    ) -> Account:
        """Update an existing account."""
        account = await self.get_account_by_id(session, account_id, user_id)

        update_data = account_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(account, key, value)

        account.updated_at = datetime.utcnow()
        session.add(account)
        try:
            await session.commit()
            await session.refresh(account)
            return account
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to update account: {e}")

    async def delete_account_with_cascade(
        self, session: AsyncSession, account_id: str, user_id: str
    ) -> None:
        """Delete an account and cascade delete its transactions and holdings."""
        account = await self.get_account_by_id(session, account_id, user_id)

        try:
            # Delete associated transactions
            await session.execute(
                delete(Transaction).where(Transaction.account_id == account_id)
            )
            # Delete associated stock holdings
            await session.execute(
                delete(StockHolding).where(StockHolding.account_id == account_id)
            )
            # Delete the account
            await session.delete(account)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to delete account: {e}")
