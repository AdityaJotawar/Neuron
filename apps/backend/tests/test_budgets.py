"""Unit tests for budgets endpoints and spent calculations."""

from datetime import datetime, timedelta
from decimal import Decimal

import pytest


async def test_get_budgets_empty(client):
    """Test getting budgets when none exist."""
    response = await client.get("/api/v1/budgets")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []


async def test_create_budget(client):
    """Test creating a new budget."""
    now = datetime.utcnow()
    payload = {
        "category": "food",
        "amount": "500.00",
        "period": "monthly",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=30)).isoformat(),
    }
    response = await client.post("/api/v1/budgets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["category"] == "food"
    assert Decimal(data["data"]["amount"]) == Decimal("500.00")
    assert Decimal(data["data"]["spent"]) == Decimal("0")
    assert "id" in data["data"]


async def test_get_budget(client):
    """Test getting an existing budget by ID."""
    now = datetime.utcnow()
    payload = {
        "category": "utilities",
        "amount": "200.00",
        "period": "monthly",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=30)).isoformat(),
    }
    create_res = await client.post("/api/v1/budgets", json=payload)
    budget_id = create_res.json()["data"]["id"]

    response = await client.get(f"/api/v1/budgets/{budget_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == budget_id
    assert data["data"]["category"] == "utilities"


async def test_get_budget_not_found(client):
    """Test getting a non-existent budget."""
    response = await client.get("/api/v1/budgets/non_existent_id")
    assert response.status_code == 404
    assert response.json()["success"] is False


async def test_update_budget(client):
    """Test updating a budget."""
    now = datetime.utcnow()
    payload = {
        "category": "entertainment",
        "amount": "100.00",
        "period": "monthly",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=30)).isoformat(),
    }
    create_res = await client.post("/api/v1/budgets", json=payload)
    budget_id = create_res.json()["data"]["id"]

    update_payload = {"amount": "150.50"}
    update_res = await client.patch(f"/api/v1/budgets/{budget_id}", json=update_payload)
    assert update_res.status_code == 200
    data = update_res.json()
    assert Decimal(data["data"]["amount"]) == Decimal("150.50")


async def test_delete_budget(client):
    """Test deleting a budget."""
    now = datetime.utcnow()
    payload = {
        "category": "shopping",
        "amount": "300.00",
        "period": "monthly",
        "start_date": now.isoformat(),
        "end_date": (now + timedelta(days=30)).isoformat(),
    }
    create_res = await client.post("/api/v1/budgets", json=payload)
    budget_id = create_res.json()["data"]["id"]

    del_res = await client.delete(f"/api/v1/budgets/{budget_id}")
    assert del_res.status_code == 204

    get_res = await client.get(f"/api/v1/budgets/{budget_id}")
    assert get_res.status_code == 404


async def test_budget_spent_calculation(client):
    """Test spent calculation for a budget with transactions in date range."""
    # Create account
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Checking", "account_type": "checking", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    now = datetime.utcnow()
    start_dt = now - timedelta(days=5)
    end_dt = now + timedelta(days=5)

    # Create budget in category 'food'
    budget_payload = {
        "category": "food",
        "amount": "500.00",
        "period": "monthly",
        "start_date": start_dt.isoformat(),
        "end_date": end_dt.isoformat(),
    }
    b_res = await client.post("/api/v1/budgets", json=budget_payload)
    budget_id = b_res.json()["data"]["id"]

    # Transaction 1: food, in range ($50)
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "50.00",
            "type": "purchase",
            "category": "food",
            "description": "Lunch",
            "date": now.isoformat(),
        },
    )

    # Transaction 2: food, in range ($25.50)
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "25.50",
            "type": "purchase",
            "category": "food",
            "description": "Dinner",
            "date": now.isoformat(),
        },
    )

    # Transaction 3: food, outside range (10 days ago) ($100)
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "100.00",
            "type": "purchase",
            "category": "food",
            "description": "Old Lunch",
            "date": (now - timedelta(days=10)).isoformat(),
        },
    )

    # Transaction 4: shopping, in range ($200)
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc_id,
            "amount": "200.00",
            "type": "purchase",
            "category": "shopping",
            "description": "Clothes",
            "date": now.isoformat(),
        },
    )

    # Fetch budget and verify spent is exactly $75.50 ($50 + $25.50)
    res = await client.get(f"/api/v1/budgets/{budget_id}")
    assert res.status_code == 200
    data = res.json()
    assert Decimal(data["data"]["spent"]) == Decimal("75.50")
