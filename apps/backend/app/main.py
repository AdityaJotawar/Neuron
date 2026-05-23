"""FastAPI application initialization and setup."""

from contextlib import asynccontextmanager
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import get_settings
from app.database import get_engine, get_session_factory
from app.middleware.error_handler import (
    general_exception_handler,
    neuron_exception_handler,
    resource_not_found_handler,
    validation_error_handler,
)
from app.routers import (
    accounts,
    budgets,
    chat,
    dashboard,
    health,
    imports,
    portfolio,
    transactions,
)
from app.utils.exceptions import (
    NeuronException,
    ResourceNotFoundError,
    ValidationError,
)

# Global state for migration status
app_state: Dict[str, bool] = {"migrations_pending": True}


def run_migrations_sync():
    """Run Alembic migrations synchronously."""
    import os
    from alembic import command as alembic_command
    from alembic.config import Config

    try:
        # Get absolute path to alembic.ini
        alembic_ini_path = os.path.join(os.path.dirname(__file__), "..", "alembic.ini")
        alembic_cfg = Config(alembic_ini_path)
        alembic_command.upgrade(alembic_cfg, "head")
        app_state["migrations_pending"] = False
        print("✓ Migrations completed successfully")
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        app_state["migrations_pending"] = True


async def health_check_db():
    """Test database connectivity."""
    try:
        engine = get_engine()
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("✓ Database connection successful")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup/shutdown."""
    # Startup
    settings = get_settings()
    print(f"🚀 Starting Neuron Backend (Environment: {settings.environment})")
    await health_check_db()
    run_migrations_sync()
    yield
    # Shutdown
    print("🛑 Shutting down Neuron Backend")


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title="Neuron Backend",
        description="REST API for Neuron financial application",
        version="0.1.0",
        lifespan=lifespan,
    )

    # Add exception handlers
    app.add_exception_handler(ValidationError, validation_error_handler)
    app.add_exception_handler(ResourceNotFoundError, resource_not_found_handler)
    app.add_exception_handler(NeuronException, neuron_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(health.router)
    app.include_router(accounts.router)
    app.include_router(transactions.router)
    app.include_router(budgets.router)
    app.include_router(portfolio.router)
    app.include_router(dashboard.router)
    app.include_router(imports.router)
    app.include_router(chat.router)

    # Middleware to check migration status
    @app.middleware("http")
    async def check_migrations_middleware(request, call_next):
        """Check if migrations are pending for domain endpoints."""
        # Allow health and docs endpoints even if migrations are pending
        if request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        # For domain endpoints, check migration status
        if request.url.path.startswith("/api/v1/"):
            if app_state.get("migrations_pending", False):
                return JSONResponse(
                    status_code=503,
                    content={
                        "success": False,
                        "error": "Service unavailable: migrations pending",
                    },
                )

        return await call_next(request)

    return app


app = create_app()
