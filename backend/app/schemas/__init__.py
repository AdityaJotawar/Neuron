"""API request and response schemas."""

from app.schemas.account import (
    AccountCreate,
    AccountResponse,
    AccountUpdate,
    CheckingMetricsSchema,
    LoanDetailsSchema,
    LoanMetricsSchema,
    PropertyDetailsSchema,
    PropertyMetricsSchema,
    SavingsMetricsSchema,
    TradingMetricsSchema,
)
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.schemas.common import ApiResponse, ErrorResponse
from app.schemas.dashboard import ChatResponse, DashboardStats, PortfolioStats
from app.schemas.import_history import ImportHistoryResponse
from app.schemas.stock_holding import (
    StockHoldingCreate,
    StockHoldingResponse,
    StockHoldingUpdate,
)
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)

__all__ = [
    "ApiResponse",
    "ErrorResponse",
    "AccountCreate",
    "AccountUpdate",
    "AccountResponse",
    "TransactionCreate",
    "TransactionUpdate",
    "TransactionResponse",
    "BudgetCreate",
    "BudgetUpdate",
    "BudgetResponse",
    "StockHoldingCreate",
    "StockHoldingUpdate",
    "StockHoldingResponse",
    "ImportHistoryResponse",
    "DashboardStats",
    "PortfolioStats",
    "ChatResponse",
]
