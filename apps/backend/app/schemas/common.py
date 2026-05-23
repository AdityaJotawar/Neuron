"""Common schemas for API responses."""

from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Generic API response wrapper."""

    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {},
                "error": None,
            }
        }


class ErrorResponse(BaseModel):
    """Error response shape."""

    success: bool = False
    error: str

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "Resource not found",
            }
        }
