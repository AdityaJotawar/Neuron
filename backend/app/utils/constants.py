"""Constants and enums for Neuron Backend."""

from enum import Enum


class AccountType(str, Enum):
    """Account type enumeration."""

    SAVINGS = "savings"
    CHECKING = "checking"
    LOAN = "loan"
    TRADING = "trading"
    PROPERTY = "property"
    CREDIT_CARD = "credit_card"
    INVESTMENT = "investment"


class TransactionType(str, Enum):
    """Transaction type enumeration."""

    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    PURCHASE = "purchase"


class BudgetPeriod(str, Enum):
    """Budget period enumeration."""

    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class ImportStatus(str, Enum):
    """Import status enumeration."""

    SUCCESS = "success"
    FAILED = "failed"
    PENDING = "pending"


class TransactionCategory(str, Enum):
    """Common transaction categories."""

    SALARY = "salary"
    HOUSING = "housing"
    FOOD = "food"
    TRANSPORTATION = "transportation"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    SHOPPING = "shopping"
    INVESTMENT = "investment"
    OTHER = "other"


# Constants
MAX_IMPORT_FILE_SIZE_MB = 50
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
ACCOUNT_ID_PREFIX = "acc_"
TRANSACTION_ID_PREFIX = "txn_"
BUDGET_ID_PREFIX = "bgt_"
IMPORT_ID_PREFIX = "imp_"
STOCK_HOLDING_ID_PREFIX = "sth_"
