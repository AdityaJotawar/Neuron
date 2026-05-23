"""Dashboard service handling business logic for aggregated stats and calculations."""

from datetime import datetime
from decimal import Decimal
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.account import Account
from app.models.stock_holding import StockHolding
from app.models.transaction import Transaction
from app.schemas.dashboard import DashboardStats


class DashboardService:
    """Service class for dashboard calculations and metrics."""

    ASSET_TYPES = {"checking", "savings", "trading", "property", "investment"}
    LIABILITY_TYPES = {"credit_card", "loan"}

    @staticmethod
    def compute_account_balance(
        account: Account, transactions: List[Transaction]
    ) -> Decimal:
        """Compute current balance of an account as initial balance + sum of transaction amounts."""
        current_balance = Decimal(str(account.balance))

        for tx in transactions:
            if tx.account_id != account.id:
                continue
            amt = Decimal(str(tx.amount))
            if tx.type in ("deposit", "transfer"):
                current_balance += amt
            elif tx.type in ("withdrawal", "purchase"):
                current_balance -= amt

        return current_balance

    async def get_stats(self, session: AsyncSession, user_id: str) -> DashboardStats:
        """Compute all dashboard financial statistics for a user."""
        now = datetime.utcnow()
        first_day_current_month = datetime(now.year, now.month, 1)

        # Fetch data
        acc_stmt = select(Account).where(Account.user_id == user_id)
        acc_res = await session.execute(acc_stmt)
        accounts = list(acc_res.scalars().all())

        tx_stmt = select(Transaction).where(Transaction.user_id == user_id)
        tx_res = await session.execute(tx_stmt)
        transactions = list(tx_res.scalars().all())

        sh_stmt = select(StockHolding).where(StockHolding.user_id == user_id)
        sh_res = await session.execute(sh_stmt)
        holdings = list(sh_res.scalars().all())

        # Current calculations
        total_assets = Decimal("0")
        total_liabilities = Decimal("0")

        # Previous month calculations
        prev_total_assets = Decimal("0")
        prev_total_liabilities = Decimal("0")

        # Split transactions by time
        prev_txs = [t for t in transactions if t.date < first_day_current_month]
        current_month_txs = [t for t in transactions if t.date >= first_day_current_month]

        for acc in accounts:
            cur_bal = self.compute_account_balance(acc, transactions)
            prev_bal = self.compute_account_balance(acc, prev_txs)

            if acc.account_type in self.ASSET_TYPES:
                total_assets += cur_bal
                prev_total_assets += prev_bal
            elif acc.account_type in self.LIABILITY_TYPES:
                total_liabilities += abs(cur_bal)
                prev_total_liabilities += abs(prev_bal)

        # Add holdings to assets
        for h in holdings:
            val = Decimal(str(h.quantity)) * Decimal(str(h.current_price))
            total_assets += val

            if h.created_at < first_day_current_month:
                prev_val = Decimal(str(h.quantity)) * Decimal(str(h.purchase_price))
                prev_total_assets += prev_val

        net_worth = total_assets - total_liabilities
        prev_net_worth = prev_total_assets - prev_total_liabilities

        monthly_income = Decimal("0")
        monthly_expenses = Decimal("0")

        for tx in current_month_txs:
            amt = Decimal(str(tx.amount))
            if tx.type in ("deposit", "transfer"):
                monthly_income += amt
            elif tx.type in ("withdrawal", "purchase"):
                monthly_expenses += amt

        monthly_cash_flow = monthly_income - monthly_expenses

        return DashboardStats(
            net_worth=round(net_worth, 2),
            total_assets=round(total_assets, 2),
            total_liabilities=round(total_liabilities, 2),
            monthly_cash_flow=round(monthly_cash_flow, 2),
            net_worth_change=round(net_worth - prev_net_worth, 2),
            assets_change=round(total_assets - prev_total_assets, 2),
            liabilities_change=round(total_liabilities - prev_total_liabilities, 2),
            monthly_income=round(monthly_income, 2),
            monthly_expenses=round(monthly_expenses, 2),
            accounts_count=len(accounts),
            transactions_count=len(transactions),
        )
