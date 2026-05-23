#!/usr/bin/env python3
"""CLI script to refresh stock holding prices with simulated fluctuations."""

import asyncio
from datetime import datetime
from decimal import Decimal
import os
import random
sys_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
import sys
sys.path.insert(0, sys_path)

from sqlmodel import select

from app.database import get_engine, get_session_factory
from app.models.stock_holding import StockHolding


async def refresh_prices():
    """Update currentPrice and lastPriceUpdate on all holdings."""
    engine = get_engine()
    session_factory = get_session_factory(engine)

    async with session_factory() as session:
        stmt = select(StockHolding)
        result = await session.execute(stmt)
        holdings = list(result.scalars().all())

        if not holdings:
            print("No stock holdings found to update.")
            return

        now = datetime.utcnow()
        count = 0
        for h in holdings:
            # Simulate a ±5% price movement
            fluctuation = Decimal(str(random.uniform(-0.05, 0.05)))
            new_price = Decimal(str(h.current_price)) * (Decimal("1") + fluctuation)
            new_price = max(new_price, Decimal("0.01"))

            h.current_price = round(new_price, 2)
            h.last_price_update = now
            h.updated_at = now
            session.add(h)
            count += 1

        try:
            await session.commit()
            print(f"Successfully updated prices for {count} stock holdings.")
        except Exception as e:
            await session.rollback()
            print(f"Error updating stock prices: {e}", file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    asyncio.run(refresh_prices())
