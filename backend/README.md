# Neuron Backend

A FastAPI-based backend for the Neuron financial application. Provides REST API endpoints for managing financial accounts, transactions, budgets, and portfolio data with a local SQLite database.

## Features

- **FastAPI**: Modern, async-first Python web framework
- **SQLite Database**: Local, file-based persistent storage
- **Async Operations**: Non-blocking database queries with aiosqlite
- **Alembic Migrations**: Versioned, reproducible database schema management
- **CORS Support**: Cross-origin requests from frontend (localhost:5173)
- **Environment Configuration**: All settings configurable via environment variables
- **Automatic Migrations**: Schema migrations run automatically on app startup

## Prerequisites

- Python 3.10 or higher
- pip or poetry for dependency management

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration if needed
```

### 4. Run the Application

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`
- Health Check: `http://localhost:8000/health`

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application initialization
│   ├── config.py            # Settings and environment configuration
│   ├── database.py          # SQLAlchemy engine and session management
│   ├── dependencies.py      # Dependency injection functions
│   ├── models.py            # SQLModel ORM models
│   ├── schemas.py           # Pydantic schemas for API requests/responses
│   └── routers/
│       ├── __init__.py
│       └── health.py        # Health check endpoint
├── alembic/                 # Database migrations
│   ├── env.py               # Alembic configuration for async SQLite
│   ├── script.py.mako       # Migration template
│   └── versions/            # Individual migration files
│       └── 001_initial_schema.py
├── scripts/                 # Utility scripts (seed data, etc.)
├── tests/                   # Unit and integration tests
├── .env.example             # Environment variables template
├── requirements.txt         # Python dependencies
├── pyproject.toml           # Project metadata and tool configuration
└── README.md                # This file
```

## API Endpoints

### Health Check
- `GET /health` - Returns `{"status": "ok"}`

### Accounts
- `GET /api/v1/accounts` - List all accounts
- `GET /api/v1/accounts/{id}` - Get account by ID
- `POST /api/v1/accounts` - Create new account
- `PATCH /api/v1/accounts/{id}` - Update account
- `DELETE /api/v1/accounts/{id}` - Delete account (cascade deletes transactions and holdings)

### Transactions
- `GET /api/v1/transactions` - List transactions with filtering
- `GET /api/v1/transactions/{id}` - Get transaction by ID
- `POST /api/v1/transactions` - Create transaction
- `PATCH /api/v1/transactions/{id}` - Update transaction
- `DELETE /api/v1/transactions/{id}` - Delete transaction
- `POST /api/v1/transactions/bulk` - Create multiple transactions
- `DELETE /api/v1/transactions/bulk` - Delete multiple transactions

### Budgets
- `GET /api/v1/budgets` - List all budgets
- `POST /api/v1/budgets` - Create budget

### Portfolio
- `GET /api/v1/portfolio/holdings` - List stock holdings
- `GET /api/v1/portfolio/stats` - Get portfolio statistics

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Imports
- `POST /api/v1/imports` - Upload CSV file
- `GET /api/v1/imports/history` - Get import history

### Chat
- `POST /api/v1/chat` - Send message to AI chat

## Running Tests

```bash
pytest
```

For verbose output:
```bash
pytest -v
```

For coverage report:
```bash
pytest --cov=app tests/
```

## Database Migrations

### Create a new migration

```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations

Migrations run automatically on application startup. To manually apply:

```bash
alembic upgrade head
```

### View migration status

```bash
alembic current
```

## Environment Variables

See `.env.example` for all supported environment variables:

- `DATABASE_URL` - SQLite database URL (default: `sqlite+aiosqlite:///./neuron.db`)
- `OLLAMA_BASE_URL` - Ollama API base URL (default: `http://localhost:11434`)
- `CORS_ORIGINS` - Comma-separated list of CORS origins (default: `http://localhost:5173`)
- `DEFAULT_USER_ID` - Default user ID for single-user setup (default: `user-1`)
- `ENVIRONMENT` - Environment type (default: `development`)
- `HOST` - Server host (default: `0.0.0.0`)
- `PORT` - Server port (default: `8000`)

## Development

### Code Style

The project uses Black for code formatting and isort for import sorting. Configuration is in `pyproject.toml`.

### Type Checking

Run mypy for static type checking:

```bash
mypy app
```

## License

MIT
