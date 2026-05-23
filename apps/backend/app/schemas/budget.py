"""Budget request and response schemas."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class BudgetCreate(BaseModel):
    """Budget creation schema."""

    category: str = Field(..., description="Budget category")
    amount: Decimal = Field(..., description="Budget limit")
    period: str = Field(..., description="Budget period")
    start_date: datetime = Field(..., description="Budget start date")
    end_date: datetime = Field(..., description="Budget end date")


class BudgetUpdate(BaseModel):
    """Budget update schema."""

    category: Optional[str] = None
    amount: Optional[Decimal] = None
    period: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class BudgetResponse(BaseModel):
    """Budget response schema."""

    id: str
    user_id: str
    category: str
    amount: Decimal
    period: str
    start_date: datetime
    end_date: datetime
    spent: Optional[Decimal] = Decimal("0")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
