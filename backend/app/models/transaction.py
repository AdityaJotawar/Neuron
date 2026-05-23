"""Transaction model."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import uuid4

from sqlmodel import Field, SQLModel


class Transaction(SQLModel, table=True):
    """Financial transaction model."""

    __tablename__ = "transactions"

    id: str = Field(primary_key=True, default_factory=lambda: str(uuid4()))
    user_id: str = Field(index=True)
    account_id: str = Field(foreign_key="accounts.id", index=True)
    amount: Decimal
    type: str  # deposit, withdrawal, transfer, purchase
    category: str
    description: str
    merchant: Optional[str] = None
    import_id: Optional[str] = None
    date: datetime = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
