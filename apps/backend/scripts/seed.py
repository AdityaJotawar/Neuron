#!/usr/bin/env python3
"""Seed script to populate the database with realistic sample data."""

import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
import os
import sys
from uuid import uuid4

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlmodel import func, select

from app.config import get_settings
from app.database import get_engine, get_session_factory
from app.models.account import Account
from app.models.budget import Budget
from app.models.stock_holding import StockHolding
from app.models.transaction import Transaction


async def check_database_has_data(session) -> bool:
    """Check if database already contains records."""
    acc_count = (await session.execute(select(func.count(Account.id)))).scalar() or 0
    tx_count = (await session.execute(select(func.count(Transaction.id)))).scalar() or 0
    budget_count = (await session.execute(select(func.count(Budget.id)))).scalar() or 0
    holding_count = (await session.execute(select(func.count(StockHolding.id)))).scalar() or 0

    return (acc_count + tx_count + budget_count + holding_count) > 0


async def seed_data():
    """Main async seeding logic."""
    settings = get_settings()
    engine = get_engine()
    session_factory = get_session_factory(engine)

    async with session_factory() as session:
        # Check if database has data
        has_data = False
        try:
            has_data = await check_database_has_data(session)
        except Exception as e:
            print(f"Error checking database contents: {e}", file=sys.stderr)
            sys.exit(1)

        if has_data:
            print("Warning: Database already contains data. Seed script aborted to prevent duplication.")
            sys.exit(0)

        print("🌱 Seeding database with sample financial data...")

        user_id = settings.default_user_id
        now = datetime.utcnow()

        # 1. Create Accounts
        accounts = [
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="High Yield Savings",
                account_type="savings",
                balance=Decimal("15000.00"),
                interest_rate=Decimal("4.5"),
                savings_metrics={"apy": 4.5, "interestEarnedYTD": 250.0},
            ),
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="Primary Checking",
                account_type="checking",
                balance=Decimal("3500.00"),
                interest_rate=Decimal("0.0"),
                checking_metrics={"monthlyFees": 0, "availableBalance": 3500.0},
            ),
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="Cashback Credit Card",
                account_type="credit_card",
                balance=Decimal("450.00"),
                interest_rate=Decimal("19.99"),
            ),
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="Tesla Auto Loan",
                account_type="loan",
                balance=Decimal("12000.00"),
                interest_rate=Decimal("5.2"),
                loan_details={
                    "originalAmount": 20000.0,
                    "remainingBalance": 12000.0,
                    "monthlyPayment": 350.0,
                    "interestRate": 5.2,
                    "payoffDate": (now + timedelta(days=1000)).isoformat(),
                    "loanType": "auto",
                },
                loan_metrics={"interestPaidThisMonth": 52.0, "principalPaidThisMonth": 298.0},
            ),
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="Robinhood Brokerage",
                account_type="trading",
                balance=Decimal("8000.00"),
                interest_rate=Decimal("0.0"),
                trading_metrics={"totalGainLoss": 1200.0, "returnRate": 15.0},
            ),
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="Primary Residence",
                account_type="property",
                balance=Decimal("350000.00"),
                interest_rate=Decimal("0.0"),
                property_details={
                    "address": "123 Main St",
                    "propertyType": "residential",
                    "purchasePrice": 300000.0,
                    "purchaseDate": (now - timedelta(days=1000)).isoformat(),
                    "currentValue": 350000.0,
                    "mortgageBalance": 200000.0,
                    "monthlyMortgage": 1500.0,
                    "rentalIncome": 0.0,
                    "propertyTax": 3000.0,
                    "insurance": 1200.0,
                },
                property_metrics={"equity": 150000.0, "appreciationRate": 5.0},
            ),
            Account(
                id=str(uuid4()),
                user_id=user_id,
                name="Fidelity 401k",
                account_type="investment",
                balance=Decimal("45000.00"),
                interest_rate=Decimal("0.0"),
            ),
        ]

        for acc in accounts:
            session.add(acc)

        # 2. Get Account IDs
        checking_id = accounts[1].id
        savings_id = accounts[0].id
        cc_id = accounts[2].id
        trading_id = accounts[4].id

        # 3. Create Budgets
        budgets = [
            Budget(
                id=str(uuid4()),
                user_id=user_id,
                category="food",
                amount=Decimal("600.00"),
                period="monthly",
                start_date=now - timedelta(days=15),
                end_date=now + timedelta(days=15),
            ),
            Budget(
                id=str(uuid4()),
                user_id=user_id,
                category="utilities",
                amount=Decimal("250.00"),
                period="monthly",
                start_date=now - timedelta(days=15),
                end_date=now + timedelta(days=15),
            ),
            Budget(
                id=str(uuid4()),
                user_id=user_id,
                category="entertainment",
                amount=Decimal("200.00"),
                period="monthly",
                start_date=now - timedelta(days=15),
                end_date=now + timedelta(days=15),
            ),
            Budget(
                id=str(uuid4()),
                user_id=user_id,
                category="shopping",
                amount=Decimal("300.00"),
                period="monthly",
                start_date=now - timedelta(days=15),
                end_date=now + timedelta(days=15),
            ),
            Budget(
                id=str(uuid4()),
                user_id=user_id,
                category="transportation",
                amount=Decimal("150.00"),
                period="monthly",
                start_date=now - timedelta(days=15),
                end_date=now + timedelta(days=15),
            ),
        ]

        for b in budgets:
            session.add(b)

        # 4. Create Stock Holdings
        holdings = [
            StockHolding(
                id=str(uuid4()),
                user_id=user_id,
                account_id=trading_id,
                symbol="AAPL",
                company_name="Apple Inc.",
                quantity=Decimal("10.00"),
                purchase_price=Decimal("150.00"),
                purchase_date=now - timedelta(days=90),
                current_price=Decimal("180.00"),
                last_price_update=now,
            ),
            StockHolding(
                id=str(uuid4()),
                user_id=user_id,
                account_id=trading_id,
                symbol="MSFT",
                company_name="Microsoft Corp.",
                quantity=Decimal("5.00"),
                purchase_price=Decimal("300.00"),
                purchase_date=now - timedelta(days=60),
                current_price=Decimal("350.00"),
                last_price_update=now,
            ),
            StockHolding(
                id=str(uuid4()),
                user_id=user_id,
                account_id=trading_id,
                symbol="GOOGL",
                company_name="Alphabet Inc.",
                quantity=Decimal("8.00"),
                purchase_price=Decimal("120.00"),
                purchase_date=now - timedelta(days=45),
                current_price=Decimal("135.00"),
                last_price_update=now,
            ),
            StockHolding(
                id=str(uuid4()),
                user_id=user_id,
                account_id=trading_id,
                symbol="AMZN",
                company_name="Amazon.com Inc.",
                quantity=Decimal("12.00"),
                purchase_price=Decimal("100.00"),
                purchase_date=now - timedelta(days=120),
                current_price=Decimal("145.00"),
                last_price_update=now,
            ),
            StockHolding(
                id=str(uuid4()),
                user_id=user_id,
                account_id=trading_id,
                symbol="NVDA",
                company_name="NVIDIA Corp.",
                quantity=Decimal("15.00"),
                purchase_price=Decimal("400.00"),
                purchase_date=now - timedelta(days=30),
                current_price=Decimal("480.00"),
                last_price_update=now,
            ),

        ]

        for h in holdings:
            session.add(h)

        # 5. Create 50+ Transactions
        transactions = []

        # Deposits (Salary)
        for i in range(4):
            tx_date = now - timedelta(days=15 * i)
            transactions.append(
                Transaction(
                    id=str(uuid4()),
                    user_id=user_id,
                    account_id=checking_id,
                    amount=Decimal("2500.00"),
                    type="deposit",
                    category="salary",
                    description="Employer Direct Deposit",
                    date=tx_date,
                )
            )

        # Savings interest
        for i in range(3):
            tx_date = now - timedelta(days=30 * i)
            transactions.append(
                Transaction(
                    id=str(uuid4()),
                    user_id=user_id,
                    account_id=savings_id,
                    amount=Decimal("56.25"),
                    type="deposit",
                    category="investment-income",
                    description="Savings Interest",
                    date=tx_date,
                )
            )

        # Spending transactions
        merchant_categories = [
            ("Starbucks", "food", "withdrawal", Decimal("6.50")),
            ("Whole Foods", "food", "purchase", Decimal("85.20")),
            ("Trader Joe's", "food", "purchase", Decimal("62.30")),
            ("Uber", "transportation", "purchase", Decimal("22.50")),
            ("Chevron Gas", "transportation", "withdrawal", Decimal("45.00")),
            ("Target", "shopping", "purchase", Decimal("54.10")),
            ("Amazon", "shopping", "purchase", Decimal("110.00")),
            ("Netflix", "entertainment", "purchase", Decimal("15.99")),
            ("Spotify", "entertainment", "purchase", Decimal("9.99")),
            ("CVS Pharmacy", "healthcare", "purchase", Decimal("25.00")),
            ("Electric Utility", "utilities", "purchase", Decimal("115.00")),
            ("Water Utility", "utilities", "purchase", Decimal("45.00")),
            ("Internet Provider", "utilities", "purchase", Decimal("79.99")),
        ]

        # Populate remaining transactions to reach at least 50 total
        import random
        random.seed(42)  # Deterministic seed for reproducible data

        for day in range(1, 40):
            tx_date = now - timedelta(days=day)
            # Add 1 to 2 transactions per day
            num_txs = random.randint(1, 2)
            for _ in range(num_txs):
                m_name, category, tx_type, base_amount = random.choice(merchant_categories)
                # Randomize amount slightly
                variation = Decimal(str(random.uniform(-0.15, 0.15)))
                amount = base_amount * (Decimal("1") + variation)
                amount = max(round(amount, 2), Decimal("1.00"))

                # Alternate account
                acc_id = checking_id if random.choice([True, False]) else cc_id

                transactions.append(
                    Transaction(
                        id=str(uuid4()),
                        user_id=user_id,
                        account_id=acc_id,
                        amount=amount,
                        type=tx_type,
                        category=category,
                        description=f"{m_name} Purchase",
                        date=tx_date,
                    )
                )

        # Truncate or ensure we have at least 50
        while len(transactions) < 52:
            transactions.append(
                Transaction(
                    id=str(uuid4()),
                    user_id=user_id,
                    account_id=checking_id,
                    amount=Decimal("12.50"),
                    type="purchase",
                    category="food",
                    description="Lunch Joint",
                    date=now - timedelta(hours=6),
                )
            )

        for tx in transactions:
            session.add(tx)

        try:
            await session.commit()
            print(f"🎉 Seeding complete! Created {len(accounts)} accounts, {len(transactions)} transactions, {len(budgets)} budgets, and {len(holdings)} holdings.")
        except Exception as e:
            await session.rollback()
            print(f"Error during commit: {e}", file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    asyncio.run(seed_data())
