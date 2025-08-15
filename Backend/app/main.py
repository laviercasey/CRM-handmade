import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

from app.api.api import api_router
from app.core.config import settings
from app.db.database import engine
from app.db.init_db import init_db
from app.db.database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    docs_url=settings.DOCS_URL,
    redoc_url=settings.REDOC_URL
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

app.mount(f"{settings.API_PREFIX}/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount(f"{settings.API_PREFIX}/images", StaticFiles(directory="uploads"), name="images")

app.include_router(api_router, prefix=settings.API_PREFIX)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing database...")
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    logger.info("Database initialized")

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {"detail": "Internal server error"}

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": f"{settings.DOCS_URL}"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
