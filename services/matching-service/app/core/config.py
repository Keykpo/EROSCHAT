from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Ero Chat - Matching Service"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/erochat"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Matching
    MATCH_TIMEOUT: int = 60  # seconds
    MAX_QUEUE_SIZE: int = 10000

    class Config:
        env_file = ".env"


settings = Settings()
