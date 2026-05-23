"""Dashboard and portfolio schemas."""

from decimal import Decimal
from typing import List

from pydantic import BaseModel, Field



class DashboardStats(BaseModel):
    """Dashboard statistics schema."""

    net_worth: Decimal = Field(..., alias="netWorth")
    total_assets: Decimal = Field(..., alias="totalAssets")
    total_liabilities: Decimal = Field(..., alias="totalLiabilities")
    monthly_cash_flow: Decimal = Field(..., alias="monthlyCashFlow")
    net_worth_change: Decimal = Field(..., alias="netWorthChange")
    assets_change: Decimal = Field(..., alias="assetsChange")
    liabilities_change: Decimal = Field(..., alias="liabilitiesChange")
    monthly_income: Decimal = Field(Decimal("0"), alias="monthlyIncome")
    monthly_expenses: Decimal = Field(Decimal("0"), alias="monthlyExpenses")
    accounts_count: int = Field(0, alias="accountsCount")
    transactions_count: int = Field(0, alias="transactionsCount")

    class Config:
        populate_by_name = True


class PortfolioStats(BaseModel):
    """Portfolio statistics schema."""

    total_value: Decimal = Field(..., alias="totalValue")
    total_cost_basis: Decimal = Field(..., alias="totalCostBasis")
    total_gain_loss: Decimal = Field(..., alias="totalGainLoss")
    return_percentage: Decimal = Field(..., alias="returnPercentage")
    holdings_count: int = Field(..., alias="holdingsCount")

    class Config:
        populate_by_name = True


class ChatResponse(BaseModel):
    """Chat message response schema."""

    message: str
    timestamp: str
    source: str = "ai"
