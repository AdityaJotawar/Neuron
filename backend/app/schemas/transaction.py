"""Transaction request and response schemas."""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    """Transaction creation schema."""

    account_id: str = Field(..., description="Account ID")
    amount: Decimal = Field(..., description="Transaction amount")
    type: str = Field(..., description="Transaction type")
    category: str = Field(..., description="Transaction category")
    description: str = Field(..., description="Transaction description")
    merchant: Optional[str] = None
    date: datetime = Field(..., description="Transaction date")


class TransactionUpdate(BaseModel):
    """Transaction update schema."""

    amount: Optional[Decimal] = None
    type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    merchant: Optional[str] = None
    date: Optional[datetime] = None


class TransactionResponse(BaseModel):
    """Transaction response schema."""

    id: str
    user_id: str
    account_id: str
    amount: Decimal
    type: str
    category: str
    description: str
    merchant: Optional[str]
    import_id: Optional[str]
    date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TransactionBulkCreate(BaseModel):
    """Bulk transaction creation schema."""

    transactions: list[TransactionCreate]


class TransactionBulkDelete(BaseModel):
    """Bulk transaction deletion schema."""

    ids: list[str]
