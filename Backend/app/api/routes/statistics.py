from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List
import logging
from datetime import datetime
import io

from app.api.deps import get_db, get_current_user
from app.crud.analytics import (
    get_statistics_overview, 
    get_requests_by_status, 
    get_activity_by_day, 
    get_top_products
)
from app.utils.report_generators import (
    generate_pdf_report, 
    generate_csv_report, 
    generate_excel_report
)
from app.schemas.analytics import (
    StatisticsOverview, 
    RequestsByStatus, 
    ActivityItem
)
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/overview", response_model=StatisticsOverview)
def get_statistics_overview_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_statistics_overview(db, current_user.id)
    except Exception as e:
        logger.error(f"Error getting statistics overview: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics overview")


@router.get("/requests-by-status", response_model=RequestsByStatus)
def get_requests_by_status_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_requests_by_status(db, current_user.id)
    except Exception as e:
        logger.error(f"Error getting requests by status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get requests by status")


@router.get("/activity-by-day", response_model=List[ActivityItem])
def get_activity_by_day_route(
    period: str = Query("week", regex="^(week|month|quarter|year)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_activity_by_day(db, current_user.id, period)
    except Exception as e:
        logger.error(f"Error getting activity by day: {e}")
        raise HTTPException(status_code=500, detail="Failed to get activity by day")


@router.get("/report")
async def generate_statistics_report(
    format: str = Query("pdf", regex="^(pdf|csv|excel)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        overview = get_statistics_overview(db, current_user.id)
        status_counts = get_requests_by_status(db, current_user.id)
        activity = get_activity_by_day(db, current_user.id, "month")
        top_products = get_top_products(db, current_user.id, 10)
        
        filename = f"statistics-report-{datetime.now().strftime('%Y-%m-%d')}"

        if format == "csv":
            content = generate_csv_report(overview, status_counts, activity, top_products)
            return Response(
                content=content,
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename={filename}.csv"}
            )
        elif format == "excel":
            content = generate_excel_report(overview, status_counts, activity, top_products)
            return Response(
                content=content,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename={filename}.xlsx"}
            )
        else:  
            content = generate_pdf_report(overview, status_counts, activity, top_products)
            return Response(
                content=content,
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={filename}.pdf"}
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error generating statistics report: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate statistics report"
        )
