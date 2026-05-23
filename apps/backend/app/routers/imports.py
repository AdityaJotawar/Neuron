"""Imports router for API endpoints."""

from typing import List, Optional

from fastapi import APIRouter, Depends, Form, Response, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.common import ApiResponse
from app.schemas.import_history import ImportHistoryResponse
from app.services.import_service import ImportService

router = APIRouter(prefix="/api/v1/imports", tags=["imports"])
import_service = ImportService()


@router.get("", response_model=ApiResponse[List[ImportHistoryResponse]])
async def get_all_imports(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get all import history records for the current user."""
    records = await import_service.get_all_imports(session, user_id)
    return ApiResponse(success=True, data=records)


@router.post("/upload", response_model=ApiResponse[ImportHistoryResponse])
async def upload_file(
    file: UploadFile,
    fileType: str = Form(...),
    accountId: Optional[str] = Form(None),
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Upload and process CSV file."""
    content = await file.read()
    res = await import_service.upload_csv(
        session,
        content,
        file.filename or "upload.csv",
        fileType,
        user_id,
        account_id=accountId,
    )
    return ApiResponse(success=True, data=res)


@router.delete("/{import_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_import(
    import_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Delete an import history record and cascade delete its imported records."""
    await import_service.delete_import_with_cascade(session, import_id, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
