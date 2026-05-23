"""AI service managing Ollama LLM integration, local context injection, and response generation."""

from datetime import datetime
from decimal import Decimal
import json
from typing import List, Optional

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.schemas.chat import ChatResponse
from app.services.budget_service import BudgetService
from app.services.dashboard_service import DashboardService
from app.services.portfolio_service import PortfolioService
from app.services.transaction_service import TransactionService


class AIService:
    """Service class for AI / Ollama interaction."""

    def __init__(self):
        self.settings = get_settings()
        self.dashboard_service = DashboardService()
        self.transaction_service = TransactionService()
        self.budget_service = BudgetService()
        self.portfolio_service = PortfolioService()

    async def check_ollama_availability(self) -> bool:
        """Check if local Ollama service is running and accessible."""
        url = f"{self.settings.ollama_base_url}/api/tags"
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(url, timeout=2.0)
                return res.status_code == 200
        except Exception:
            return False

    async def _get_available_model(self) -> str:
        """Fetch first available model from Ollama tags, default to 'llama3'."""
        url = f"{self.settings.ollama_base_url}/api/tags"
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(url, timeout=2.0)
                if res.status_code == 200:
                    models = res.json().get("models", [])
                    if models:
                        return models[0]["name"]
        except Exception:
            pass
        return "llama3"

    def _generate_suggestions(
        self,
        stats: any,
        budgets: List[any],
        portfolio: any,
        message: str,
    ) -> List[str]:
        """Generate 3 contextually relevant follow-up suggestions based on financial data and message."""
        suggestions = []

        # Suggestion 1: Budget related
        if budgets:
            over_budget = [b for b in budgets if b.spent > b.amount]
            if over_budget:
                suggestions.append(f"How can I manage my budget for {over_budget[0].category}?")
            else:
                suggestions.append("Which budget categories have the most room left?")
        else:
            suggestions.append("How do I set up a monthly budget?")

        # Suggestion 2: Portfolio / Investment related
        if portfolio.total_value > 0:
            if portfolio.total_gain_loss >= 0:
                suggestions.append("What is driving my portfolio gains?")
            else:
                suggestions.append("How can I minimize portfolio losses?")
        else:
            suggestions.append("Should I add stocks to my portfolio?")

        # Suggestion 3: Cash flow / General
        if stats.monthly_cash_flow < 0:
            suggestions.append("Why was my cash flow negative this month?")
        else:
            suggestions.append("How can I optimize my monthly savings?")

        # Keep exactly 3 suggestions
        return suggestions[:3]

    async def send_message(
        self,
        session: AsyncSession,
        message: str,
        session_id: str,
        user_id: str,
    ) -> ChatResponse:
        """Check Ollama availability, build prompt with context, and query local LLM."""
        is_available = await self.check_ollama_availability()
        if not is_available:
            return ChatResponse(
                response="Ollama is not running. Please start your local Ollama service to chat with your data.",
                session_id=session_id,
                suggestions=[
                    "How do I install Ollama?",
                    "What features does Neuron support?",
                    "How to seed sample data?",
                ],
            )

        # 1. Fetch user data context
        stats = await self.dashboard_service.get_stats(session, user_id)
        txs = await self.transaction_service.get_all_transactions(
            session, user_id=user_id
        )
        txs = txs[:20]

        budgets = await self.budget_service.get_all_budgets(session, user_id)
        portfolio = await self.portfolio_service.get_portfolio_stats(session, user_id)

        # 2. Build system context prompt
        system_prompt = (
            "You are Neuron, a helpful local personal finance assistant. You have access to the user's financial data.\n"
            "Here is the user's financial profile:\n"
            f"- Net Worth: ${stats.net_worth:,.2f} (Assets: ${stats.total_assets:,.2f}, Liabilities: ${stats.total_liabilities:,.2f})\n"
            f"- Monthly Cash Flow: ${stats.monthly_cash_flow:,.2f} (MoM Change: ${stats.net_worth_change:,.2f})\n"
            "Budgets:\n"
        )
        for b in budgets:
            system_prompt += f"  - {b.category}: Limit ${b.amount:,.2f}, Spent ${b.spent:,.2f} (Period: {b.period})\n"

        system_prompt += (
            f"Portfolio Stats: Total Value ${portfolio.total_value:,.2f}, "
            f"Gain/Loss ${portfolio.total_gain_loss:,.2f} ({portfolio.return_percentage}% return)\n"
            "Recent Transactions (top 20):\n"
        )
        for t in txs:
            system_prompt += f"  - {t.date.strftime('%Y-%m-%d')} | {t.type.upper()} | {t.category} | ${t.amount:,.2f} | {t.description}\n"

        system_prompt += (
            "\nBased on the above financial profile, provide a concise, direct, and actionable answer to the user's query.\n"
            "Keep the response brief and professional."
        )

        model = await self._get_available_model()
        url = f"{self.settings.ollama_base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": f"{system_prompt}\n\nUser: {message}\nAssistant:",
            "stream": False,
        }

        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(url, json=payload, timeout=30.0)
                if res.status_code == 200:
                    ai_text = res.json().get("response", "").strip()
                else:
                    ai_text = f"Error communicating with local LLM (Ollama returned {res.status_code})."
        except Exception as e:
            ai_text = f"Failed to reach local LLM: {str(e)}"

        suggestions = self._generate_suggestions(stats, budgets, portfolio, message)

        return ChatResponse(
            response=ai_text,
            session_id=session_id,
            suggestions=suggestions,
        )
