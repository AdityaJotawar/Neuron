"""Unit tests for dashboard stats and calculations."""

from datetime import datetime, timedelta
from decimal import Decimal

import pytest


async def test_get_dashboard_stats_empty(client):
    """Test getting dashboard stats when no accounts or transactions exist."""
    response = await client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert Decimal(data["data"]["netWorth"]) == Decimal("0")
    assert Decimal(data["data"]["totalAssets"]) == Decimal("0")
    assert Decimal(data["data"]["totalLiabilities"]) == Decimal("0")
    assert Decimal(data["data"]["monthlyCashFlow"]) == Decimal("0")


async def test_get_dashboard_stats_with_data(client):
    """Test getting dashboard stats with asset/liability accounts, transactions, and stock holdings."""
    # 1. Create Checking Account (Asset, $1000 initial balance)
    acc1_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Checking", "account_type": "checking", "balance": "1000"},
    )
    acc1_id = acc1_res.json()["data"]["id"]

    # 2. Create Loan Account (Liability, $500 balance)
    await client.post(
        "/api/v1/accounts",
        json={"name": "Car Loan", "account_type": "loan", "balance": "500"},
    )

    # 3. Create Stock Holding ($100 price * 10 shares = $1000 asset)
    await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc1_id,
            "symbol": "AAPL",
            "company_name": "Apple",
            "quantity": "10",
            "purchase_price": "90",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "100",
        },
    )

    # 4. Create Deposit in current month ($200)
    now = datetime.utcnow()
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc1_id,
            "amount": "200.00",
            "type": "deposit",
            "category": "salary",
            "description": "Paycheck",
            "date": now.isoformat(),
        },
    )

    # 5. Create Withdrawal in current month ($50)
    await client.post(
        "/api/v1/transactions",
        json={
            "account_id": acc1_id,
            "amount": "50.00",
            "type": "withdrawal",
            "category": "food",
            "description": "Grocery",
            "date": now.isoformat(),
        },
    )

    # 6. Verify Dashboard Stats
    # Checking Account current balance: 1000 + 200 (dep) - 50 (wd) = 1150
    # Stock Holding value: 10 * 100 = 1000
    # Total Assets: 1150 + 1000 = 2150
    # Total Liabilities: 500 (Loan)
    # Net Worth: 2150 - 500 = 1650
    # Monthly Cash Flow: 200 - 50 = 150

    response = await client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

    stats = data["data"]
    assert Decimal(stats["totalAssets"]) == Decimal("2150.00")
    assert Decimal(stats["totalLiabilities"]) == Decimal("500.00")
    assert Decimal(stats["netWorth"]) == Decimal("1650.00")
    assert Decimal(stats["monthlyCashFlow"]) == Decimal("150.00")
    assert stats["accountsCount"] == 2
    assert stats["transactionsCount"] == 2
