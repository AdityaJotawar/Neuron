"""Configuration management for Neuron Backend."""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "sqlite+aiosqlite:///./neuron.db"

    # Ollama
    ollama_base_url: str = "http://localhost:11434"

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Application
    default_user_id: str = "user-1"
    environment: str = "development"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string to list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    def is_production(self) -> bool:
        """Check if running in production."""
        return self.environment.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
