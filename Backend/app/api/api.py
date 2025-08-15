from fastapi import APIRouter
from app.api.routes import auth, users, requests, products, materials, analytics, statistics, uploads

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(products.router, prefix="/product", tags=["products"])
api_router.include_router(materials.router, prefix="/materials", tags=["materials"])
api_router.include_router(analytics.router, prefix="/calculations", tags=["analytics"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
api_router.include_router(uploads.router, prefix="/upload", tags=["uploads"])
