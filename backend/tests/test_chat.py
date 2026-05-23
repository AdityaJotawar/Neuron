"""Unit tests for chat messages and Ollama integration."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest


async def test_chat_ollama_unavailable(client):
    """Test chat fallback response when Ollama is offline."""
    with patch(
        "app.services.ai_service.AIService.check_ollama_availability",
        new_callable=AsyncMock,
    ) as mock_avail:
        mock_avail.return_value = False

        payload = {"message": "How much money do I have?"}
        response = await client.post("/api/v1/chat/message", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "Ollama is not running" in data["data"]["response"]
        assert len(data["data"]["suggestions"]) == 3
        assert "sessionId" in data["data"]


async def test_chat_success(client):
    """Test successful chat message exchange and context generation."""
    with patch(
        "app.services.ai_service.AIService.check_ollama_availability",
        new_callable=AsyncMock,
    ) as mock_avail, patch(
        "app.services.ai_service.httpx.AsyncClient"
    ) as mock_client_class:

        mock_avail.return_value = True

        # Setup mock client instance
        mock_instance = AsyncMock()
        mock_client_class.return_value.__aenter__.return_value = mock_instance

        # Mock GET /api/tags
        mock_tags_res = MagicMock()
        mock_tags_res.status_code = 200
        mock_tags_res.json.return_value = {"models": [{"name": "llama3"}]}
        mock_instance.get.return_value = mock_tags_res

        # Mock POST /api/generate
        mock_gen_res = MagicMock()
        mock_gen_res.status_code = 200
        mock_gen_res.json.return_value = {"response": "You have a solid budget."}
        mock_instance.post.return_value = mock_gen_res

        payload = {"message": "Am I on budget?", "sessionId": "test-session-123"}
        response = await client.post("/api/v1/chat/message", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["response"] == "You have a solid budget."
        assert data["data"]["sessionId"] == "test-session-123"
        assert len(data["data"]["suggestions"]) == 3
