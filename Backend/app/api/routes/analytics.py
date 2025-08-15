from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import logging

from app.api.deps import get_db, get_current_user
from app.crud.analytics import (
    get_financial_stats, 
    get_profit_trend, 
    calculate_product_price, 
    get_top_products
)
from app.schemas.analytics import (
    FinancialStats, 
    ProfitTrendItem, 
    ProductCalculationInput, 
    ProductCalculation, 
    TopProduct
)
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/financial", response_model=FinancialStats)
def get_financial_stats_route(
    period: str = Query("month", regex="^(week|month|quarter|year)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_financial_stats(db, current_user.id, period)
    except Exception as e:
        logger.error(f"Error getting financial stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get financial stats")


@router.get("/profit-trend", response_model=List[ProfitTrendItem])
def get_profit_trend_route(
    period: str = Query("week", regex="^(week|month|quarter|year)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_profit_trend(db, current_user.id, period)
    except Exception as e:
        logger.error(f"Error getting profit trend: {e}")
        raise HTTPException(status_code=500, detail="Failed to get profit trend")


@router.post("/product", response_model=ProductCalculation)
def calculate_product_price_route(
    calculation_data: ProductCalculationInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return calculate_product_price(db, calculation_data, current_user.id)
    except Exception as e:
        logger.error(f"Error calculating product price: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate product price")


@router.get("/top-products", response_model=List[TopProduct])
def get_top_products_route(
    limit: int = Query(5, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_top_products(db, current_user.id, limit)
    except Exception as e:
        logger.error(f"Error getting top products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get top products")
