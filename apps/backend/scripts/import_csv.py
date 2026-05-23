#!/usr/bin/env python3
"""CLI script to import CSV records into the Neuron database."""

import argparse
import asyncio
import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import get_settings
from app.database import get_engine, get_session_factory
from app.services.import_service import ImportService


async def run_import(file_path: str, file_type: str, account_id: str = None):
    """Run the import operation asynchronously."""
    settings = get_settings()
    engine = get_engine()
    session_factory = get_session_factory(engine)

    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.", file=sys.stderr)
        sys.exit(1)

    try:
        with open(file_path, "rb") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file '{file_path}': {e}", file=sys.stderr)
        sys.exit(1)

    async with session_factory() as session:
        import_service = ImportService()
        try:
            res = await import_service.upload_csv(
                session,
                content,
                os.path.basename(file_path),
                file_type,
                settings.default_user_id,
                account_id=account_id,
            )

            print(f"Import completed with status: {res.status}")
            print(f"totalRows: {res.total_rows}")
            print(f"successfulRows: {res.successful_rows}")
            print(f"failedRows: {res.failed_rows}")

            if res.error_message:
                print(f"Error Details: {res.error_message}", file=sys.stderr)

            if res.status == "failed":
                sys.exit(1)
        except Exception as e:
            print(f"Import process failed: {e}", file=sys.stderr)
            sys.exit(1)


def main():
    """Main CLI entrypoint."""
    parser = argparse.ArgumentParser(description="Import financial data from a CSV file.")
    parser.add_argument(
        "--file", required=True, help="Path to the CSV file to import."
    )
    parser.add_argument(
        "--type",
        required=True,
        choices=["transactions", "accounts", "stock_holdings"],
        help="Type of records being imported.",
    )
    parser.add_argument(
        "--account-id",
        required=False,
        help="Optional Account ID to associate with transactions/holdings.",
    )

    args = parser.parse_args()

    asyncio.run(run_import(args.file, args.type, args.account_id))


if __name__ == "__main__":
    main()
