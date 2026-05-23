"""Database setup and session management."""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config import get_settings


def get_engine():
    """Create async SQLAlchemy engine."""
    settings = get_settings()
    return create_async_engine(
        settings.database_url,
        echo=settings.environment == "development",
        future=True,
    )


def get_session_factory(engine):
    """Create session factory."""
    return sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )
