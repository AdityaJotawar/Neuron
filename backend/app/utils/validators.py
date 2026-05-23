"""Input validation helpers."""

from decimal import Decimal

from app.utils.exceptions import ValidationError


def validate_positive_amount(amount: Decimal, field_name: str = "amount") -> Decimal:
    """Validate that amount is positive."""
    if amount <= 0:
        raise ValidationError(f"{field_name} must be greater than 0")
    return amount


def validate_date_range(start_date, end_date, field_name: str = "date range") -> tuple:
    """Validate that start_date is before end_date."""
    if start_date >= end_date:
        raise ValidationError(f"Invalid {field_name}: start date must be before end date")
    return start_date, end_date


def validate_string_not_empty(value: str, field_name: str = "field") -> str:
    """Validate that string is not empty."""
    if not value or not value.strip():
        raise ValidationError(f"{field_name} cannot be empty")
    return value.strip()


def validate_account_type(account_type: str) -> str:
    """Validate account type."""
    valid_types = {
        "savings",
        "checking",
        "loan",
        "trading",
        "property",
        "credit_card",
        "investment",
    }
    if account_type not in valid_types:
        raise ValidationError(
            f"Invalid account type '{account_type}'. Must be one of {valid_types}"
        )
    return account_type


def validate_transaction_type(transaction_type: str) -> str:
    """Validate transaction type."""
    valid_types = {"deposit", "withdrawal", "transfer", "purchase"}
    if transaction_type not in valid_types:
        raise ValidationError(
            f"Invalid transaction type '{transaction_type}'. Must be one of {valid_types}"
        )
    return transaction_type


def validate_budget_period(period: str) -> str:
    """Validate budget period."""
    valid_periods = {"weekly", "monthly", "yearly"}
    if period not in valid_periods:
        raise ValidationError(
            f"Invalid budget period '{period}'. Must be one of {valid_periods}"
        )
    return period
