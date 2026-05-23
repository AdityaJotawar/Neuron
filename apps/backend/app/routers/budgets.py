"""Budgets router for API endpoints."""

from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.schemas.common import ApiResponse
from app.services.budget_service import BudgetService

router = APIRouter(prefix="/api/v1/budgets", tags=["budgets"])
budget_service = BudgetService()


@router.get("", response_model=ApiResponse[List[BudgetResponse]])
async def get_budgets(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get all budgets for the current user."""
    budgets = await budget_service.get_all_budgets(session, user_id)
    return ApiResponse(success=True, data=budgets)


@router.get("/{budget_id}", response_model=ApiResponse[BudgetResponse])
async def get_budget(
    budget_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get a specific budget by ID."""
    budget = await budget_service.get_budget_by_id(session, budget_id, user_id)
    return ApiResponse(success=True, data=budget)


@router.post(
    "", status_code=status.HTTP_201_CREATED, response_model=ApiResponse[BudgetResponse]
)
async def create_budget(
    budget_create: BudgetCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Create a new budget."""
    budget = await budget_service.create_budget(session, budget_create, user_id)
    return ApiResponse(success=True, data=budget)


@router.patch("/{budget_id}", response_model=ApiResponse[BudgetResponse])
async def update_budget(
    budget_id: str,
    budget_update: BudgetUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Update an existing budget."""
    budget = await budget_service.update_budget(session, budget_id, budget_update, user_id)
    return ApiResponse(success=True, data=budget)


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(
    budget_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Delete a budget."""
    await budget_service.delete_budget(session, budget_id, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
