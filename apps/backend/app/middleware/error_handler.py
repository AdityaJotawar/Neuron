"""Global exception handler middleware."""

import logging
from datetime import datetime

from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.utils.exceptions import NeuronException, ResourceNotFoundError, ValidationError

logger = logging.getLogger(__name__)


async def neuron_exception_handler(request: Request, exc: NeuronException):
    """Handle NeuronException and its subclasses."""
    logger.error(
        f"[{datetime.utcnow().isoformat()}] {request.method} {request.url.path} - "
        f"{exc.__class__.__name__}: {exc.message}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.message},
    )


async def validation_error_handler(request: Request, exc: ValidationError):
    """Handle ValidationError."""
    logger.warning(
        f"[{datetime.utcnow().isoformat()}] {request.method} {request.url.path} - "
        f"ValidationError: {exc.message}"
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": exc.message},
    )


async def resource_not_found_handler(request: Request, exc: ResourceNotFoundError):
    """Handle ResourceNotFoundError."""
    logger.warning(
        f"[{datetime.utcnow().isoformat()}] {request.method} {request.url.path} - "
        f"ResourceNotFoundError: {exc.message}"
    )

    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"success": False, "error": exc.message},
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    import traceback
    traceback.print_exc()
    logger.error(
        f"[{datetime.utcnow().isoformat()}] {request.method} {request.url.path} - "
        f"Unhandled {exc.__class__.__name__}: {str(exc)}"
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "Internal server error"},
    )
