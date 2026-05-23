"""Stock holding request and response schemas."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class StockHoldingCreate(BaseModel):
    """Stock holding creation schema."""

    account_id: str = Field(..., description="Account ID")
    symbol: str = Field(..., description="Stock symbol")
    company_name: str = Field(..., description="Company name")
    quantity: Decimal = Field(..., description="Number of shares")
    purchase_price: Decimal = Field(..., description="Purchase price per share")
    purchase_date: datetime = Field(..., description="Purchase date")
    current_price: Decimal = Field(..., description="Current price per share")


class StockHoldingUpdate(BaseModel):
    """Stock holding update schema."""

    quantity: Optional[Decimal] = None
    purchase_price: Optional[Decimal] = None
    purchase_date: Optional[datetime] = None
    current_price: Optional[Decimal] = None


class StockHoldingResponse(BaseModel):
    """Stock holding response schema."""

    id: str
    user_id: str
    account_id: str
    symbol: str
    company_name: str
    quantity: Decimal
    purchase_price: Decimal
    purchase_date: datetime
    current_price: Decimal
    last_price_update: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
