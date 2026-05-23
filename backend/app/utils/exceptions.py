"""Custom exception classes for Neuron Backend."""


class NeuronException(Exception):
    """Base exception for Neuron Backend."""

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ResourceNotFoundError(NeuronException):
    """Raised when a resource is not found."""

    def __init__(self, resource_type: str, resource_id: str):
        message = f"{resource_type} with id '{resource_id}' not found"
        super().__init__(message, status_code=404)


class ValidationError(NeuronException):
    """Raised when input validation fails."""

    def __init__(self, message: str):
        super().__init__(message, status_code=422)


class OllamaUnavailableError(NeuronException):
    """Raised when Ollama service is unavailable."""

    def __init__(self, message: str = "Ollama service is unavailable"):
        super().__init__(message, status_code=503)


class FileTooLargeError(NeuronException):
    """Raised when uploaded file exceeds size limit."""

    def __init__(self, max_size_mb: int):
        message = f"File size exceeds maximum allowed size of {max_size_mb}MB"
        super().__init__(message, status_code=413)


class DatabaseError(NeuronException):
    """Raised when database operation fails."""

    def __init__(self, message: str):
        super().__init__(message, status_code=500)


class UnauthorizedError(NeuronException):
    """Raised when user is not authorized."""

    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)
