"""Chat request and response schemas."""

from typing import List, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Chat request schema."""

    message: str = Field(..., description="User message")
    session_id: Optional[str] = Field(None, alias="sessionId")

    class Config:
        populate_by_name = True


class ChatResponse(BaseModel):
    """Chat response schema."""

    response: str
    session_id: str = Field(..., alias="sessionId")
    suggestions: List[str]

    class Config:
        populate_by_name = True
