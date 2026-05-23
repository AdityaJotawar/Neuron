"""Account model and nested detail models."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import uuid4

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class LoanDetails(SQLModel):
    """Nested details for loan accounts."""

    original_amount: Decimal
    remaining_balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal
    payoff_date: datetime
    loan_type: str


class PropertyDetails(SQLModel):
    """Nested details for property accounts."""

    address: str
    property_type: str
    purchase_price: Decimal
    purchase_date: datetime
    current_value: Decimal
    mortgage_balance: Decimal
    monthly_mortgage: Decimal
    rental_income: Decimal
    property_tax: Decimal
    insurance: Decimal


class SavingsMetrics(SQLModel):
    """Metrics for savings accounts."""

    interest_earned_ytd: Decimal
    apy: Decimal


class CheckingMetrics(SQLModel):
    """Metrics for checking accounts."""

    monthly_fees: Decimal
    available_balance: Decimal


class LoanMetrics(SQLModel):
    """Metrics for loan accounts."""

    interest_paid_this_month: Decimal
    principal_paid_this_month: Decimal


class TradingMetrics(SQLModel):
    """Metrics for trading accounts."""

    total_gain_loss: Decimal
    return_rate: Decimal


class PropertyMetrics(SQLModel):
    """Metrics for property accounts."""

    equity: Decimal
    appreciation_rate: Decimal


class Account(SQLModel, table=True):
    """Financial account model."""

    __tablename__ = "accounts"

    id: str = Field(primary_key=True, default_factory=lambda: str(uuid4()))
    user_id: str = Field(index=True)
    name: str
    account_type: str
    balance: Decimal
    interest_rate: Decimal
    currency: str = "USD"
    icon: Optional[str] = None
    color: Optional[str] = None
    account_number: Optional[str] = None
    import_id: Optional[str] = Field(default=None, index=True)


    # JSON columns for nested details
    loan_details: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    property_details: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    savings_metrics: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    checking_metrics: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    loan_metrics: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    trading_metrics: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    property_metrics: Optional[dict] = Field(default=None, sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
