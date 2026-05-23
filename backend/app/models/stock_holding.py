"""Stock holding model."""

from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import uuid4


from sqlmodel import Field, SQLModel


class StockHolding(SQLModel, table=True):
    """Stock holding model."""

    __tablename__ = "stock_holdings"

    id: str = Field(primary_key=True, default_factory=lambda: str(uuid4()))
    user_id: str = Field(index=True)
    account_id: str = Field(foreign_key="accounts.id", index=True)
    symbol: str
    company_name: str
    quantity: Decimal
    purchase_price: Decimal
    purchase_date: datetime
    current_price: Decimal
    import_id: Optional[str] = Field(default=None, index=True)
    last_price_update: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
