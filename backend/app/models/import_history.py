"""Import history model."""

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlmodel import Field, SQLModel


class ImportHistory(SQLModel, table=True):
    """Import history model."""

    __tablename__ = "import_history"

    id: str = Field(primary_key=True, default_factory=lambda: str(uuid4()))
    user_id: str = Field(index=True)
    file_name: str
    file_type: str  # transactions, accounts, stock_holdings
    status: str  # pending, processing, completed, failed
    total_rows: int = 0
    successful_rows: int = 0
    failed_rows: int = 0
    error_message: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    account_id: Optional[str] = None
    account_name: Optional[str] = None
