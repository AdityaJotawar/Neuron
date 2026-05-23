"""Import history response schema."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ImportHistoryResponse(BaseModel):
    """Import history response schema."""

    id: str
    user_id: str = Field(..., alias="userId")
    file_name: str = Field(..., alias="fileName")
    file_type: str = Field(..., alias="fileType")
    status: str
    total_rows: int = Field(..., alias="totalRows")
    successful_rows: int = Field(..., alias="successfulRows")
    failed_rows: int = Field(..., alias="failedRows")
    error_message: Optional[str] = Field(None, alias="errorMessage")
    uploaded_at: datetime = Field(..., alias="uploadedAt")
    completed_at: Optional[datetime] = Field(None, alias="completedAt")
    account_id: Optional[str] = Field(None, alias="accountId")
    account_name: Optional[str] = Field(None, alias="accountName")

    class Config:
        populate_by_name = True
        from_attributes = True
