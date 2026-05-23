"""Accounts router for API endpoints."""

from typing import List

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.account import AccountCreate, AccountResponse, AccountUpdate
from app.schemas.common import ApiResponse
from app.services.account_service import AccountService

router = APIRouter(prefix="/api/v1/accounts", tags=["accounts"])
account_service = AccountService()


@router.get("", response_model=ApiResponse[List[AccountResponse]])
async def get_accounts(
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get all accounts for the current user."""
    accounts = await account_service.get_all_accounts(session, user_id)
    return ApiResponse(success=True, data=accounts)


@router.get("/{account_id}", response_model=ApiResponse[AccountResponse])
async def get_account(
    account_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get a specific account by ID."""
    account = await account_service.get_account_by_id(session, account_id, user_id)
    return ApiResponse(success=True, data=account)


@router.post(
    "", status_code=status.HTTP_201_CREATED, response_model=ApiResponse[AccountResponse]
)
async def create_account(
    account_create: AccountCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Create a new account."""
    account = await account_service.create_account(session, account_create, user_id)
    return ApiResponse(success=True, data=account)


@router.patch("/{account_id}", response_model=ApiResponse[AccountResponse])
async def update_account(
    account_id: str,
    account_update: AccountUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Update an existing account."""
    account = await account_service.update_account(
        session, account_id, account_update, user_id
    )
    return ApiResponse(success=True, data=account)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(
    account_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Delete an account and cascade delete its transactions and holdings."""
    await account_service.delete_account_with_cascade(session, account_id, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
