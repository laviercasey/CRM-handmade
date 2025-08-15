import os
from pydantic_settings import BaseSettings
from typing import Optional, List
from pathlib import Path


class Settings(BaseSettings):
    APP_NAME: str = "TvoyCRM"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    API_PREFIX: str = "/api/v1"

    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    DOCS_URL: Optional[str] = "/docs"
    REDOC_URL: Optional[str] = "/redoc"
    
    UPLOAD_DIR: Path = Path("uploads")
    AVATAR_DIR: Path = UPLOAD_DIR / "avatars"
    
    FIRST_SUPERUSER_USERNAME: str = os.getenv("FIRST_SUPERUSER_USERNAME", "admin")
    FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@example.com")
    FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "password")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()

settings.UPLOAD_DIR.mkdir(exist_ok=True)
settings.AVATAR_DIR.mkdir(exist_ok=True)
