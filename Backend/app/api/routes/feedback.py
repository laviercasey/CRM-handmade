from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
import logging

from app.api.deps import get_db, get_current_user
from app.crud.feedback import create_feedback, get_feedbacks
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", response_model=FeedbackResponse)
def create_feedback_endpoint(
    feedback: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_feedback(db, feedback, current_user.id)


@router.get("", response_model=List[FeedbackResponse])
def read_feedbacks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):      
    return get_feedbacks(db, skip, limit)
