"""Dependency injection functions."""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_engine, get_session_factory


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get database session dependency."""
    engine = get_engine()
    session_factory = get_session_factory(engine)

    async with session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


def get_user_id() -> str:
    """Get current user ID dependency (stub for single-user auth)."""
    settings = get_settings()
    return settings.default_user_id
