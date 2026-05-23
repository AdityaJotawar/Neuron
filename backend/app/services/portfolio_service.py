"""Portfolio service handling business logic for stock holdings, portfolio stats, and price refreshing."""

from datetime import datetime
from decimal import Decimal
import random
from typing import List
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.account import Account
from app.models.stock_holding import StockHolding
from app.schemas.dashboard import PortfolioStats
from app.schemas.stock_holding import StockHoldingCreate, StockHoldingUpdate
from app.utils.exceptions import DatabaseError, ResourceNotFoundError, ValidationError


class PortfolioService:
    """Service class for portfolio operations."""

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

    async def get_all_holdings(
        self, session: AsyncSession, user_id: str
    ) -> List[StockHolding]:
        """Get all stock holdings for a user."""
        stmt = select(StockHolding).where(StockHolding.user_id == user_id)
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def get_holding_by_id(
        self, session: AsyncSession, holding_id: str, user_id: str
    ) -> StockHolding:
        """Get a specific holding by ID and user ID."""
        stmt = select(StockHolding).where(
            StockHolding.id == holding_id, StockHolding.user_id == user_id
        )
        result = await session.execute(stmt)
        holding = result.scalars().first()
        if not holding:
            raise ResourceNotFoundError("StockHolding", holding_id)
        return holding

    async def create_holding(
        self, session: AsyncSession, holding_create: StockHoldingCreate, user_id: str
    ) -> StockHolding:
        """Create a new stock holding after validating account exists."""
        await self._validate_account_exists(
            session, holding_create.account_id, user_id
        )

        data = holding_create.model_dump()
        holding = StockHolding(
            id=str(uuid4()),
            user_id=user_id,
            last_price_update=datetime.utcnow(),
            **data,
        )
        session.add(holding)
        try:
            await session.commit()
            await session.refresh(holding)
            return holding
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to create stock holding: {e}")

    async def update_holding(
        self,
        session: AsyncSession,
        holding_id: str,
        holding_update: StockHoldingUpdate,
        user_id: str,
    ) -> StockHolding:
        """Update an existing stock holding."""
        holding = await self.get_holding_by_id(session, holding_id, user_id)

        update_data = holding_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(holding, key, value)

        if "current_price" in update_data and update_data["current_price"] is not None:
            holding.last_price_update = datetime.utcnow()

        holding.updated_at = datetime.utcnow()
        session.add(holding)
        try:
            await session.commit()
            await session.refresh(holding)
            return holding
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to update stock holding: {e}")

    async def delete_holding(
        self, session: AsyncSession, holding_id: str, user_id: str
    ) -> None:
        """Delete a stock holding."""
        holding = await self.get_holding_by_id(session, holding_id, user_id)
        try:
            await session.delete(holding)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to delete stock holding: {e}")

    async def get_portfolio_stats(
        self, session: AsyncSession, user_id: str
    ) -> PortfolioStats:
        """Calculate portfolio statistics across all holdings."""
        holdings = await self.get_all_holdings(session, user_id)

        total_value = Decimal("0")
        total_cost_basis = Decimal("0")
        total_gain_loss = Decimal("0")

        for h in holdings:
            val = Decimal(str(h.quantity)) * Decimal(str(h.current_price))
            cost = Decimal(str(h.quantity)) * Decimal(str(h.purchase_price))
            gain = val - cost
            total_value += val
            total_cost_basis += cost
            total_gain_loss += gain

        if total_cost_basis > 0:
            return_pct = (total_gain_loss / total_cost_basis) * Decimal("100")
        else:
            return_pct = Decimal("0")

        return PortfolioStats(
            total_value=round(total_value, 2),
            total_cost_basis=round(total_cost_basis, 2),
            total_gain_loss=round(total_gain_loss, 2),
            return_percentage=round(return_pct, 2),
            holdings_count=len(holdings),
        )

    async def refresh_prices(
        self, session: AsyncSession, user_id: str
    ) -> List[StockHolding]:
        """Simulate updated stock prices for all holdings."""
        holdings = await self.get_all_holdings(session, user_id)
        if not holdings:
            return []

        now = datetime.utcnow()
        for h in holdings:
            # Simulate a realistic price fluctuation between -2% and +2%
            fluctuation = Decimal(str(random.uniform(-0.02, 0.02)))
            new_price = Decimal(str(h.current_price)) * (Decimal("1") + fluctuation)
            new_price = max(new_price, Decimal("0.01"))

            h.current_price = round(new_price, 2)
            h.last_price_update = now
            h.updated_at = now
            session.add(h)

        try:
            await session.commit()
            for h in holdings:
                await session.refresh(h)
            return holdings
        except Exception as e:
            await session.rollback()
            raise DatabaseError(f"Failed to refresh stock prices: {e}")
