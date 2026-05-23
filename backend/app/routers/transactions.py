"""Transactions router for API endpoints."""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.common import ApiResponse
from app.schemas.transaction import (
    TransactionBulkCreate,
    TransactionBulkDelete,
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/api/v1/transactions", tags=["transactions"])
transaction_service = TransactionService()


@router.get("", response_model=ApiResponse[List[TransactionResponse]])
async def get_transactions(
    account_id: Optional[str] = Query(None, alias="accountId"),
    start_date: Optional[datetime] = Query(None, alias="startDate"),
    end_date: Optional[datetime] = Query(None, alias="endDate"),
    category: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get transactions with optional filtering."""
    transactions = await transaction_service.get_all_transactions(
        session,
        user_id,
        account_id=account_id,
        start_date=start_date,
        end_date=end_date,
        category=category,
    )
    return ApiResponse(success=True, data=transactions)


@router.post(
    "/bulk",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[List[TransactionResponse]],
)
async def create_bulk_transactions(
    bulk_create: TransactionBulkCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Create multiple transactions in bulk."""
    transactions = await transaction_service.create_bulk_transactions(
        session, bulk_create.transactions, user_id
    )
    return ApiResponse(success=True, data=transactions)


@router.delete("/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bulk_transactions(
    bulk_delete: TransactionBulkDelete,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Delete multiple transactions in bulk."""
    await transaction_service.delete_bulk_transactions(session, bulk_delete.ids, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ApiResponse[TransactionResponse],
)
async def create_transaction(
    transaction_create: TransactionCreate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Create a new transaction."""
    transaction = await transaction_service.create_transaction(
        session, transaction_create, user_id
    )
    return ApiResponse(success=True, data=transaction)


@router.get("/{transaction_id}", response_model=ApiResponse[TransactionResponse])
async def get_transaction(
    transaction_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Get a specific transaction by ID."""
    transaction = await transaction_service.get_transaction_by_id(
        session, transaction_id, user_id
    )
    return ApiResponse(success=True, data=transaction)


@router.patch("/{transaction_id}", response_model=ApiResponse[TransactionResponse])
async def update_transaction(
    transaction_id: str,
    transaction_update: TransactionUpdate,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Update an existing transaction."""
    transaction = await transaction_service.update_transaction(
        session, transaction_id, transaction_update, user_id
    )
    return ApiResponse(success=True, data=transaction)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: str,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Delete a transaction."""
    await transaction_service.delete_transaction(session, transaction_id, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
