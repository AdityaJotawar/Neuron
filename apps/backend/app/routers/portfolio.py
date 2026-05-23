"""Portfolio router for API endpoints."""

from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.common import ApiResponse
from app.schemas.dashboard import PortfolioStats
from app.schemas.stock_holding import (
    StockHoldingCreate,
    StockHoldingResponse,
    StockHoldingUpdate,
)
from app.services.portfolio_service import PortfolioService

router = APIRouter(prefix="/api/v1/portfolio", tags=["portfolio"])
portfolio_service = PortfolioService()


@router.get("/holdings", response_model=ApiResponse[List[StockHoldingResponse]])
async def get_holdings(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get all stock holdings for the current user."""
    holdings = await portfolio_service.get_all_holdings(session, user_id)
    return ApiResponse(success=True, data=holdings)


@router.get("/stats", response_model=ApiResponse[PortfolioStats])
async def get_portfolio_stats(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get portfolio statistics."""
    stats = await portfolio_service.get_portfolio_stats(session, user_id)
    return ApiResponse(success=True, data=stats)


@router.post(
    "/refresh-prices", response_model=ApiResponse[List[StockHoldingResponse]]
)
async def refresh_prices(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Simulate updated stock prices for all holdings."""
    holdings = await portfolio_service.refresh_prices(session, user_id)
    return ApiResponse(success=True, data=holdings)


@router.get("/holdings/{holding_id}", response_model=ApiResponse[StockHoldingResponse])
async def get_holding(
    holding_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get a specific stock holding by ID."""
    holding = await portfolio_service.get_holding_by_id(session, holding_id, user_id)
    return ApiResponse(success=True, data=holding)


@router.post(
    "/holdings",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[StockHoldingResponse],
)
async def create_holding(
    holding_create: StockHoldingCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Create a new stock holding."""
    holding = await portfolio_service.create_holding(session, holding_create, user_id)
    return ApiResponse(success=True, data=holding)


@router.patch(
    "/holdings/{holding_id}", response_model=ApiResponse[StockHoldingResponse]
)
async def update_holding(
    holding_id: str,
    holding_update: StockHoldingUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Update an existing stock holding."""
    holding = await portfolio_service.update_holding(
        session, holding_id, holding_update, user_id
    )
    return ApiResponse(success=True, data=holding)


@router.delete("/holdings/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_holding(
    holding_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Delete a stock holding."""
    await portfolio_service.delete_holding(session, holding_id, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
