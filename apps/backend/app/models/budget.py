"""Budget model."""

from datetime import datetime
from decimal import Decimal
from uuid import uuid4

from sqlmodel import Field, SQLModel


class Budget(SQLModel, table=True):
    """Budget model."""

    __tablename__ = "budgets"

    id: str = Field(primary_key=True, default_factory=lambda: str(uuid4()))
    user_id: str = Field(index=True)
    category: str
    amount: Decimal
    period: str  # weekly, monthly, yearly
    start_date: datetime
    end_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
