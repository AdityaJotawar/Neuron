"""Dashboard router for API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.common import ApiResponse
from app.schemas.dashboard import DashboardStats
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])
dashboard_service = DashboardService()


@router.get("/stats", response_model=ApiResponse[DashboardStats])
async def get_stats(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get dashboard financial stats for the current user."""
    stats = await dashboard_service.get_stats(session, user_id)
    return ApiResponse(success=True, data=stats)
