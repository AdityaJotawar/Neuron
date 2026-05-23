"""Pytest fixtures for testing Neuron Backend."""

import os
import tempfile
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.dependencies import get_session, get_user_id
from app.main import app, app_state

# Ensure migrations check doesn't block tests
app_state["migrations_pending"] = False


@pytest_asyncio.fixture(scope="function")
async def test_session() -> AsyncGenerator[AsyncSession, None]:
    """Create an async session with an isolated temporary SQLite database."""
    fd, temp_db = tempfile.mkstemp(suffix=".db")
    os.close(fd)

    engine = create_async_engine(f"sqlite+aiosqlite:///{temp_db}", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    await engine.dispose()
    if os.path.exists(temp_db):
        os.remove(temp_db)


@pytest_asyncio.fixture(scope="function")
async def client(test_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create an AsyncClient test client with dependency overrides."""

    async def override_get_session():
        yield test_session

    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[get_user_id] = lambda: "test_user_123"

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
