import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    DATABASE_PATH = os.environ.get("DATABASE_PATH", str(BASE_DIR / "database.db"))

    # CORS — add production frontend URL via FRONTEND_URL env var
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
    ]
    extra_origin = os.environ.get("FRONTEND_URL")
    if extra_origin:
        CORS_ORIGINS.append(extra_origin)

    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_HTTPONLY = True
