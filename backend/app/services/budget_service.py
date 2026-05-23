"""Budget service handling business logic for budgets and spent calculations."""

from datetime import datetime
from decimal import Decimal
from typing import List
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.utils.exceptions import DatabaseError, ResourceNotFoundError


class BudgetService:
    """Service class for budget operations."""

    async def get_spent_for_budget(
        self, session: AsyncSession, budget: Budget
    ) -> Decimal:
        """Compute spent amount for a budget based on transactions matching category and date range."""
        stmt = select(Transaction.amount).where(
            Transaction.user_id == budget.user_id,
            Transaction.category == budget.category,
            Transaction.date >= budget.start_date,
            Transaction.date <= budget.end_date,
        )
        result = await session.execute(stmt)
        amounts = result.scalars().all()
        return sum(amounts, Decimal("0"))

    async def _get_budget_orm(
        self, session: AsyncSession, budget_id: str, user_id: str
    ) -> Budget:
        """Helper to get Budget ORM object by ID and user ID."""
        stmt = select(Budget).where(Budget.id == budget_id, Budget.user_id == user_id)
        result = await session.execute(stmt)
        budget = result.scalars().first()
        if not budget:
            raise ResourceNotFoundError("Budget", budget_id)
        return budget

    async def get_all_budgets(
        self, session: AsyncSession, user_id: str
    ) -> List[BudgetResponse]:
        """Get all budgets for a user with computed spent amount."""
        stmt = select(Budget).where(Budget.user_id == user_id)
        result = await session.execute(stmt)
        budgets = result.scalars().all()

        responses = []
        for b in budgets:
            spent = await self.get_spent_for_budget(session, b)
            resp = BudgetResponse.model_validate(b)
            resp.spent = spent
            responses.append(resp)
        return responses

    async def get_budget_by_id(
        self, session: AsyncSession, budget_id: str, user_id: str
    ) -> BudgetResponse:
        """Get a specific budget by ID with computed spent amount."""
        budget = await self._get_budget_orm(session, budget_id, user_id)
        spent = await self.get_spent_for_budget(session, budget)
        resp = BudgetResponse.model_validate(budget)
        resp.spent = spent
        return resp

    async def create_budget(
        self, session: AsyncSession, budget_create: BudgetCreate, user_id: str
    ) -> BudgetResponse:
        """Create a new budget."""
        data = budget_create.model_dump()
        budget = Budget(id=str(uuid4()), user_id=user_id, **data)
        session.add(budget)
        try:
            await session.commit()
            await session.refresh(budget)
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to create budget: {e}")

        spent = await self.get_spent_for_budget(session, budget)
        resp = BudgetResponse.model_validate(budget)
        resp.spent = spent
        return resp

    async def update_budget(
        self,
        session: AsyncSession,
        budget_id: str,
        budget_update: BudgetUpdate,
        user_id: str,
    ) -> BudgetResponse:
        """Update an existing budget."""
        budget = await self._get_budget_orm(session, budget_id, user_id)

        update_data = budget_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(budget, key, value)

        budget.updated_at = datetime.utcnow()
        session.add(budget)
        try:
            await session.commit()
            await session.refresh(budget)
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to update budget: {e}")

        spent = await self.get_spent_for_budget(session, budget)
        resp = BudgetResponse.model_validate(budget)
        resp.spent = spent
        return resp

    async def delete_budget(
        self, session: AsyncSession, budget_id: str, user_id: str
    ) -> None:
        """Delete a budget."""
        budget = await self._get_budget_orm(session, budget_id, user_id)
        try:
            await session.delete(budget)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to delete budget: {e}")
