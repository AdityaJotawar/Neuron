"""Unit tests for CSV import router and cascade delete operations."""

from datetime import datetime
from decimal import Decimal
import io

import pytest


async def test_get_imports_empty(client):
    """Test getting import history when none exist."""
    response = await client.get("/api/v1/imports")
    assert response.status_code == 200
    assert response.json()["data"] == []


async def test_upload_file_too_large(client):
    """Test upload of file exceeding 10MB limit."""
    huge_content = b"a" * (11 * 1024 * 1024)  # 11MB
    files = {"file": ("huge.csv", huge_content, "text/csv")}
    data = {"fileType": "transactions"}
    response = await client.post("/api/v1/imports/upload", files=files, data=data)
    assert response.status_code == 413
    assert response.json()["success"] is False


async def test_upload_transactions_csv_success(client):
    """Test successful upload and import of transactions CSV."""
    # 1. Create account first
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Checking", "account_type": "checking", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    # 2. Prepare valid CSV content
    csv_content = (
        "amount,type,category,description,date\n"
        "150.00,deposit,salary,Paycheck,2026-05-19T00:00:00\n"
        "30.25,purchase,food,Lunch,2026-05-19T00:00:00\n"
    )

    files = {"file": ("tx.csv", csv_content.encode("utf-8"), "text/csv")}
    data = {"fileType": "transactions", "accountId": acc_id}

    response = await client.post("/api/v1/imports/upload", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True

    import_record = res_data["data"]
    assert import_record["status"] == "completed"
    assert import_record["totalRows"] == 2
    assert import_record["successfulRows"] == 2
    assert import_record["failedRows"] == 0

    # 3. Verify transactions created in DB
    tx_res = await client.get(f"/api/v1/transactions?accountId={acc_id}")
    assert tx_res.status_code == 200
    txs = tx_res.json()["data"]
    assert len(txs) == 2
    assert Decimal(txs[0]["amount"]) in [Decimal("150.00"), Decimal("30.25")]


async def test_upload_transactions_csv_partial_error(client):
    """Test CSV import with mixed valid and invalid rows."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Checking", "account_type": "checking", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    # Row 1 is valid, Row 2 is invalid (missing category/type etc)
    csv_content = (
        "amount,type,category,description,date\n"
        "150.00,deposit,salary,Paycheck,2026-05-19T00:00:00\n"
        "invalid_amount,invalid_type,food,Lunch,invalid_date\n"
    )

    files = {"file": ("tx_mixed.csv", csv_content.encode("utf-8"), "text/csv")}
    data = {"fileType": "transactions", "accountId": acc_id}

    response = await client.post("/api/v1/imports/upload", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()["data"]
    assert res_data["status"] == "completed"
    assert res_data["totalRows"] == 2
    assert res_data["successfulRows"] == 1
    assert res_data["failedRows"] == 1
    assert "Row 2:" in res_data["errorMessage"]


async def test_delete_import_cascade(client):
    """Test that deleting an import cascades and removes imported records."""
    acc_res = await client.post(
        "/api/v1/accounts",
        json={"name": "Checking", "account_type": "checking", "balance": "1000"},
    )
    acc_id = acc_res.json()["data"]["id"]

    csv_content = (
        "amount,type,category,description,date\n"
        "99.99,deposit,salary,Bonus,2026-05-19T00:00:00\n"
    )

    files = {"file": ("cascade.csv", csv_content.encode("utf-8"), "text/csv")}
    data = {"fileType": "transactions", "accountId": acc_id}

    upload_res = await client.post("/api/v1/imports/upload", files=files, data=data)
    import_id = upload_res.json()["data"]["id"]

    # Verify transaction exists
    tx_res_before = await client.get(f"/api/v1/transactions?accountId={acc_id}")
    assert len(tx_res_before.json()["data"]) == 1

    # Delete import record
    del_res = await client.delete(f"/api/v1/imports/{import_id}")
    assert del_res.status_code == 204

    # Verify transaction deleted
    tx_res_after = await client.get(f"/api/v1/transactions?accountId={acc_id}")
    assert len(tx_res_after.json()["data"]) == 0
