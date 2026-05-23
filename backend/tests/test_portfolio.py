"""Unit tests for portfolio holdings, stats, and price refreshing."""

from datetime import datetime
from decimal import Decimal

import pytest


async def test_get_holdings_empty(client):
    """Test getting holdings when none exist."""
    response = await client.get("/api/v1/portfolio/holdings")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] == []


async def test_create_holding_missing_account(client):
    """Test creating holding for non-existent account."""
    payload = {
        "account_id": "non_existent_acc",
        "symbol": "AAPL",
        "company_name": "Apple Inc.",
        "quantity": "10",
        "purchase_price": "150.00",
        "purchase_date": datetime.utcnow().isoformat(),
        "current_price": "155.00",
    }
    response = await client.post("/api/v1/portfolio/holdings", json=payload)
    assert response.status_code == 422
    assert response.json()["success"] is False


async def test_create_holding(client):
    """Test creating a stock holding successfully."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Investment", "account_type": "trading", "balance": "5000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    payload = {
        "account_id": acc_id,
        "symbol": "GOOGL",
        "company_name": "Alphabet Inc.",
        "quantity": "5",
        "purchase_price": "2800.00",
        "purchase_date": datetime.utcnow().isoformat(),
        "current_price": "2850.00",
    }
    response = await client.post("/api/v1/portfolio/holdings", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["symbol"] == "GOOGL"
    assert Decimal(data["data"]["quantity"]) == Decimal("5")
    assert "id" in data["data"]


async def test_get_holding(client):
    """Test getting a holding by ID."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Trading", "account_type": "trading", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    create_res = await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc_id,
            "symbol": "MSFT",
            "company_name": "Microsoft",
            "quantity": "10",
            "purchase_price": "300",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "310",
        },
    )
    holding_id = create_res.json()["data"]["id"]

    res = await client.get(f"/api/v1/portfolio/holdings/{holding_id}")
    assert res.status_code == 200
    assert res.json()["data"]["symbol"] == "MSFT"


async def test_update_holding(client):
    """Test updating a holding."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Trading", "account_type": "trading", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    create_res = await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc_id,
            "symbol": "AMZN",
            "company_name": "Amazon",
            "quantity": "10",
            "purchase_price": "100",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "105",
        },
    )
    holding_id = create_res.json()["data"]["id"]

    update_res = await client.patch(
        f"/api/v1/portfolio/holdings/{holding_id}",
        json={"quantity": "15", "current_price": "110"},
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert Decimal(data["data"]["quantity"]) == Decimal("15")
    assert Decimal(data["data"]["current_price"]) == Decimal("110")


async def test_delete_holding(client):
    """Test deleting a holding."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Trading", "account_type": "trading", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    create_res = await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc_id,
            "symbol": "NVDA",
            "company_name": "NVIDIA",
            "quantity": "5",
            "purchase_price": "500",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "520",
        },
    )
    holding_id = create_res.json()["data"]["id"]

    del_res = await client.delete(f"/api/v1/portfolio/holdings/{holding_id}")
    assert del_res.status_code == 204

    get_res = await client.get(f"/api/v1/portfolio/holdings/{holding_id}")
    assert get_res.status_code == 404


async def test_get_portfolio_stats(client):
    """Test calculating portfolio stats across multiple holdings."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Trading", "account_type": "trading", "balance": "10000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    # Holding 1: AAPL, 10 shares, purchase $150, current $175 -> Value $1750, Cost $1500, Gain +$250
    await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc_id,
            "symbol": "AAPL",
            "company_name": "Apple",
            "quantity": "10",
            "purchase_price": "150",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "175",
        },
    )

    # Holding 2: TSLA, 5 shares, purchase $200, current $180 -> Value $900, Cost $1000, Gain -$100
    await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc_id,
            "symbol": "TSLA",
            "company_name": "Tesla",
            "quantity": "5",
            "purchase_price": "200",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "180",
        },
    )

    # Total Value: $2650
    # Total Cost Basis: $2500
    # Total Gain Loss: +$150
    # Return %: (150 / 2500) * 100 = 6%

    res = await client.get("/api/v1/portfolio/stats")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert Decimal(data["data"]["totalValue"]) == Decimal("2650.00")
    assert Decimal(data["data"]["totalCostBasis"]) == Decimal("2500.00")
    assert Decimal(data["data"]["totalGainLoss"]) == Decimal("150.00")
    assert Decimal(data["data"]["returnPercentage"]) == Decimal("6.00")
    assert data["data"]["holdingsCount"] == 2


async def test_refresh_prices(client):
    """Test refreshing stock prices."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Trading", "account_type": "trading", "balance": "10000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    await client.post(
        "/api/v1/portfolio/holdings",
        json={
            "account_id": acc_id,
            "symbol": "META",
            "company_name": "Meta",
            "quantity": "10",
            "purchase_price": "300",
            "purchase_date": datetime.utcnow().isoformat(),
            "current_price": "300",
        },
    )

    res = await client.post("/api/v1/portfolio/refresh-prices")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) == 1
    assert "current_price" in data["data"][0]
