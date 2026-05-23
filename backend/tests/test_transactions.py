"""Unit tests and property tests for transactions endpoints."""

import asyncio
from datetime import datetime, timedelta
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
from app.models.transaction import Transaction
from app.services.dashboard_service import DashboardService
from app.services.transaction_service import TransactionService


async def test_get_transactions_empty(client):
    """Test getting transactions when none exist."""
    response = await client.get("/api/v1/transactions")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []


async def test_create_transaction_missing_account(client):
    """Test creating a transaction for a non-existent account."""
    payload = {
        "account_id": "non_existent_acc",
        "amount": "50.00",
        "type": "purchase",
        "category": "food",
        "description": "Lunch",
        "date": datetime.utcnow().isoformat(),
    }
    response = await client.post("/api/v1/transactions", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "does not exist" in data["error"].lower()


async def test_create_transaction_success(client):
    """Test creating a transaction successfully."""
    # Create account first
    acc_payload = {
        "name": "Checking",
        "account_type": "checking",
        "balance": "1000.00",
    }
    acc_res = await client.post("/api/v1/accounts", json=acc_payload)
    acc_id = acc_res.json()["data"]["id"]

    # Create transaction
    tx_payload = {
        "account_id": acc_id,
        "amount": "15.75",
        "type": "purchase",
        "category": "food",
        "description": "Coffee",
        "date": datetime.utcnow().isoformat(),
    }
    tx_res = await client.post("/api/v1/transactions", json=tx_payload)
    assert tx_res.status_code == 201
    data = tx_res.json()
    assert data["success"] is True
    assert Decimal(data["data"]["amount"]) == Decimal("15.75")
    assert data["data"]["category"] == "food"
    assert data["data"]["type"] == "purchase"
    assert "id" in data["data"]


async def test_get_transaction(client):
    """Test getting a transaction by ID."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Acc", "account_type": "savings", "balance": "100"},
    )
    acc_id = acc_res.json()["data"]["id"]

    tx_res = await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "100",
            "type": "deposit",
            "category": "salary",
            "description": "Pay",
            "date": datetime.utcnow().isoformat(),
        },
    )
    tx_id = tx_res.json()["data"]["id"]

    res = await client.get(f"/api/v1/transactions/{tx_id}")
    assert res.status_code == 200
    assert res.json()["success"] is True
    assert res.json()["data"]["id"] == tx_id


async def test_filter_transactions(client):
    """Test filtering transactions by accountId, startDate, endDate, category."""
    acc_res1 = await client.post(
        "/api/v1/accounts",
        json={"name": "Acc1", "account_type": "savings", "balance": "100"},
    )
    acc_id1 = acc_res1.json()["data"]["id"]

    acc_res2 = await client.post(
        "/api/v1/accounts",
        json={"name": "Acc2", "account_type": "checking", "balance": "200"},
    )
    acc_id2 = acc_res2.json()["data"]["id"]

    now = datetime.utcnow()
    d1 = (now - timedelta(days=10)).isoformat()
    d2 = (now - timedelta(days=5)).isoformat()
    d3 = now.isoformat()

    # Tx1: Acc1, d1, salary
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id1,
            "amount": "1000",
            "type": "deposit",
            "category": "salary",
            "description": "T1",
            "date": d1,
        },
    )

    # Tx2: Acc1, d2, food
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id1,
            "amount": "50",
            "type": "purchase",
            "category": "food",
            "description": "T2",
            "date": d2,
        },
    )

    # Tx3: Acc2, d3, food
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id2,
            "amount": "25",
            "type": "purchase",
            "category": "food",
            "description": "T3",
            "date": d3,
        },
    )

    # Filter by accountId
    res_acc1 = await client.get(f"/api/v1/transactions?accountId={acc_id1}")
    assert len(res_acc1.json()["data"]) == 2

    # Filter by category
    res_food = await client.get("/api/v1/transactions?category=food")
    assert len(res_food.json()["data"]) == 2

    # Filter by startDate & endDate
    res_date = await client.get(f"/api/v1/transactions?startDate={d2}&endDate={d2}")
    assert len(res_date.json()["data"]) == 1
    assert res_date.json()["data"][0]["description"] == "T2"


async def test_update_transaction(client):
    """Test updating a transaction."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Acc", "account_type": "savings", "balance": "100"},
    )
    acc_id = acc_res.json()["data"]["id"]

    tx_res = await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "50",
            "type": "purchase",
            "category": "food",
            "description": "Snack",
            "date": datetime.utcnow().isoformat(),
        },
    )
    tx_id = tx_res.json()["data"]["id"]

    res = await client.patch(
        f"/api/v1/transactions/{tx_id}",
        json={"amount": "75.50", "category": "entertainment"},
    )
    assert res.status_code == 200
    data = res.json()
    assert Decimal(data["data"]["amount"]) == Decimal("75.50")
    assert data["data"]["category"] == "entertainment"


async def test_delete_transaction(client):
    """Test deleting a transaction."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Acc", "account_type": "savings", "balance": "100"},
    )
    acc_id = acc_res.json()["data"]["id"]

    tx_res = await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "50",
            "type": "purchase",
            "category": "food",
            "description": "To Delete",
            "date": datetime.utcnow().isoformat(),
        },
    )
    tx_id = tx_res.json()["data"]["id"]

    del_res = await client.delete(f"/api/v1/transactions/{tx_id}")
    assert del_res.status_code == 204

    get_res = await client.get(f"/api/v1/transactions/{tx_id}")
    assert get_res.status_code == 404


async def test_bulk_transactions(client):
    """Test bulk creating and deleting transactions."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Acc", "account_type": "checking", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    bulk_create_payload = {
        "transactions": [
            {
                "account_id": acc_id,
                "amount": "10",
                "type": "purchase",
                "category": "food",
                "description": "B1",
                "date": datetime.utcnow().isoformat(),
            },
            {
                "account_id": acc_id,
                "amount": "20",
                "type": "purchase",
                "category": "housing",
                "description": "B2",
                "date": datetime.utcnow().isoformat(),
            },
        ]
    }
    create_res = await client.post("/api/v1/transactions/bulk", json=bulk_create_payload)
    assert create_res.status_code == 201
    created_data = create_res.json()["data"]
    assert len(created_data) == 2
    tx_ids = [t["id"] for t in created_data]

    # Now delete bulk
    del_res = await client.request(
        "DELETE", "/api/v1/transactions/bulk", json={"ids": tx_ids}
    )
    assert del_res.status_code == 204

    # Verify deleted
    res_list = await client.get(f"/api/v1/transactions?accountId={acc_id}")
    assert len(res_list.json()["data"]) == 0


# Property 1: Account Balance Consistency
@given(
    initial_balance=st.decimals(min_value=-1000, max_value=100000, places=2),
    tx_deposits=st.lists(
        st.decimals(min_value=1, max_value=5000, places=2), min_size=0, max_size=5
    ),
    tx_withdrawals=st.lists(
        st.decimals(min_value=1, max_value=5000, places=2), min_size=0, max_size=5
    ),
)
def test_property_account_balance_consistency(
    initial_balance, tx_deposits, tx_withdrawals
):
    """Property test verifying that for any account, computed currentBalance = initialBalance + sum(deposits/transfers) - sum(withdrawals/purchases)."""
    account = Account(
        id="acc_prop_1",
        user_id="u1",
        name="Test",
        account_type="savings",
        balance=initial_balance,
        interest_rate=Decimal("0"),
    )

    transactions = []
    expected_balance = initial_balance

    for amt in tx_deposits:
        transactions.append(
            Transaction(
                id="tx_d",
                user_id="u1",
                account_id=account.id,
                amount=amt,
                type="deposit",
                category="salary",
                description="dep",
                date=datetime.utcnow(),
            )
        )
        expected_balance += amt

    for amt in tx_withdrawals:
        transactions.append(
            Transaction(
                id="tx_w",
                user_id="u1",
                account_id=account.id,
                amount=amt,
                type="withdrawal",
                category="food",
                description="with",
                date=datetime.utcnow(),
            )
        )
        expected_balance -= amt

    computed_balance = DashboardService.compute_account_balance(account, transactions)
    assert computed_balance == expected_balance
