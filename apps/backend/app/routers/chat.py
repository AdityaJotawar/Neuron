"""Chat router for AI / Ollama interaction."""

from uuid import uuid4

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_session, get_user_id
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import ApiResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])
ai_service = AIService()


@router.post("/message", response_model=ApiResponse[ChatResponse])
async def send_chat_message(
    chat_req: ChatRequest,
    session: AsyncSession = Depends(get_session),
    user_id: str = Depends(get_user_id),
):
    """Send user message to AI assistant with injected financial context."""
    session_id = chat_req.session_id or str(uuid4())
    res = await ai_service.send_message(session, chat_req.message, session_id, user_id)
    return ApiResponse(success=True, data=res)
