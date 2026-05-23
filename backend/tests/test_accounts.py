"""Unit tests and property tests for accounts endpoints."""

import asyncio
from datetime import datetime
from decimal import Decimal
import os
import tempfile

from hypothesis import given, strategies as st
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.models.account import Account
from app.models.stock_holding import StockHolding
from app.models.transaction import Transaction
from app.services.account_service import AccountService


async def test_get_accounts_empty(client):
    """Test getting accounts when none exist."""
    response = await client.get("/api/v1/accounts")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []


async def test_create_account(client):
    """Test creating a new account."""
    payload = {
        "name": "My Checking",
        "account_type": "checking",
        "balance": "1500.50",
        "currency": "USD",
    }
    response = await client.post("/api/v1/accounts", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "My Checking"
    assert Decimal(data["data"]["balance"]) == Decimal("1500.50")
    assert data["data"]["account_type"] == "checking"
    assert "id" in data["data"]


async def test_get_account(client):
    """Test getting an existing account by ID."""
    # First create
    payload = {
        "name": "Savings",
        "account_type": "savings",
        "balance": "5000.00",
    }
    create_res = await client.post("/api/v1/accounts", json=payload)
    account_id = create_res.json()["data"]["id"]

    # Now fetch
    response = await client.get(f"/api/v1/accounts/{account_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == account_id
    assert data["data"]["name"] == "Savings"


async def test_get_account_not_found(client):
    """Test getting a non-existent account."""
    response = await client.get("/api/v1/accounts/non_existent_id")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert "not found" in data["error"].lower()


async def test_update_account(client):
    """Test updating an account."""
    # First create
    payload = {
        "name": "Old Name",
        "account_type": "savings",
        "balance": "100.00",
    }
    create_res = await client.post("/api/v1/accounts", json=payload)
    account_id = create_res.json()["data"]["id"]

    # Update
    update_payload = {"name": "New Name", "balance": "250.75"}
    update_res = await client.patch(f"/api/v1/accounts/{account_id}", json=update_payload)
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["success"] is True
    assert data["data"]["name"] == "New Name"
    assert Decimal(data["data"]["balance"]) == Decimal("250.75")


async def test_delete_account(client, test_session):
    """Test deleting an account."""
    payload = {
        "name": "To Delete",
        "account_type": "checking",
        "balance": "0.00",
    }
    create_res = await client.post("/api/v1/accounts", json=payload)
    account_id = create_res.json()["data"]["id"]

    # Delete
    del_res = await client.delete(f"/api/v1/accounts/{account_id}")
    assert del_res.status_code == 204

    # Verify not found
    get_res = await client.get(f"/api/v1/accounts/{account_id}")
    assert get_res.status_code == 404


# Property 2: Cascade Delete Atomicity
@given(
    tx_count=st.integers(min_value=1, max_value=5),
    holding_count=st.integers(min_value=1, max_value=5),
)
def test_property_cascade_delete_atomicity(tx_count, holding_count):
    """Property test verifying that deleting an account deletes all its transactions and holdings in the same transaction."""

    async def _run():
        fd, temp_db = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        engine = create_async_engine(f"sqlite+aiosqlite:///{temp_db}", echo=False)
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

        session_factory = sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )

        user_id = "test_prop_user"
        account_service = AccountService()

        async with session_factory() as session:
            # Create account
            account = Account(
                id="acc_123",
                user_id=user_id,
                name="Prop Account",
                account_type="trading",
                balance=Decimal("10000"),
                interest_rate=Decimal("0"),
            )
            session.add(account)

            # Create transactions
            for i in range(tx_count):
                tx = Transaction(
                    id=f"tx_{i}",
                    user_id=user_id,
                    account_id="acc_123",
                    amount=Decimal("10.50"),
                    type="deposit",
                    category="salary",
                    description="test tx",
                    date=datetime.utcnow(),
                )
                session.add(tx)

            # Create holdings
            for i in range(holding_count):
                holding = StockHolding(
                    id=f"sh_{i}",
                    user_id=user_id,
                    account_id="acc_123",
                    symbol=f"SYM{i}",
                    company_name=f"Company {i}",
                    quantity=Decimal("5"),
                    purchase_price=Decimal("100"),
                    purchase_date=datetime.utcnow(),
                    current_price=Decimal("105"),
                    last_price_update=datetime.utcnow(),
                )
                session.add(holding)

            await session.commit()

        # Now perform cascade delete
        async with session_factory() as session:
            await account_service.delete_account_with_cascade(session, "acc_123", user_id)

        # Verify account, transactions, and holdings are completely gone
        async with session_factory() as session:
            acc_res = await session.execute(
                select(Account).where(Account.id == "acc_123")
            )
            assert acc_res.scalars().first() is None

            tx_res = await session.execute(
                select(Transaction).where(Transaction.account_id == "acc_123")
            )
            assert len(tx_res.scalars().all()) == 0

            sh_res = await session.execute(
                select(StockHolding).where(StockHolding.account_id == "acc_123")
            )
            assert len(sh_res.scalars().all()) == 0

        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.drop_all)
        await engine.dispose()
        if os.path.exists(temp_db):
            os.remove(temp_db)

    asyncio.run(_run())
