"""Account request and response schemas."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel


class LoanDetailsSchema(BaseModel):
    """Loan details schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    original_amount: Decimal
    remaining_balance: Decimal
    monthly_payment: Decimal
    interest_rate: Decimal
    payoff_date: datetime
    loan_type: str


class PropertyDetailsSchema(BaseModel):
    """Property details schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

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


class SavingsMetricsSchema(BaseModel):
    """Savings metrics schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    interest_earned_ytd: Decimal = Field(..., alias="interestEarnedYTD")
    apy: Decimal


class CheckingMetricsSchema(BaseModel):
    """Checking metrics schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    monthly_fees: Decimal
    available_balance: Decimal


class LoanMetricsSchema(BaseModel):
    """Loan metrics schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    interest_paid_this_month: Decimal
    principal_paid_this_month: Decimal


class TradingMetricsSchema(BaseModel):
    """Trading metrics schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total_gain_loss: Decimal
    return_rate: Decimal


class PropertyMetricsSchema(BaseModel):
    """Property metrics schema."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    equity: Decimal
    appreciation_rate: Decimal


class AccountCreate(BaseModel):
    """Account creation schema."""

    name: str = Field(..., description="Account name")
    account_type: str = Field(..., description="Account type")
    balance: Decimal = Field(..., description="Initial account balance")
    interest_rate: Decimal = Field(default=Decimal("0"))
    currency: str = Field(default="USD")
    icon: Optional[str] = None
    color: Optional[str] = None
    account_number: Optional[str] = None
    loan_details: Optional[LoanDetailsSchema] = None
    property_details: Optional[PropertyDetailsSchema] = None
    savings_metrics: Optional[SavingsMetricsSchema] = None
    checking_metrics: Optional[CheckingMetricsSchema] = None
    loan_metrics: Optional[LoanMetricsSchema] = None
    trading_metrics: Optional[TradingMetricsSchema] = None
    property_metrics: Optional[PropertyMetricsSchema] = None


class AccountUpdate(BaseModel):
    """Account update schema."""

    name: Optional[str] = None
    balance: Optional[Decimal] = None
    interest_rate: Optional[Decimal] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    account_number: Optional[str] = None
    loan_details: Optional[LoanDetailsSchema] = None
    property_details: Optional[PropertyDetailsSchema] = None
    savings_metrics: Optional[SavingsMetricsSchema] = None
    checking_metrics: Optional[CheckingMetricsSchema] = None
    loan_metrics: Optional[LoanMetricsSchema] = None
    trading_metrics: Optional[TradingMetricsSchema] = None
    property_metrics: Optional[PropertyMetricsSchema] = None


class AccountResponse(BaseModel):
    """Account response schema."""

    id: str
    user_id: str
    name: str
    account_type: str
    balance: Decimal
    interest_rate: Decimal
    currency: str
    icon: Optional[str]
    color: Optional[str]
    account_number: Optional[str]
    loan_details: Optional[LoanDetailsSchema]
    property_details: Optional[PropertyDetailsSchema]
    savings_metrics: Optional[SavingsMetricsSchema]
    checking_metrics: Optional[CheckingMetricsSchema]
    loan_metrics: Optional[LoanMetricsSchema]
    trading_metrics: Optional[TradingMetricsSchema]
    property_metrics: Optional[PropertyMetricsSchema]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
