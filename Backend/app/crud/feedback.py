from sqlalchemy.orm import Session
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate


def create_feedback(db: Session, feedback: FeedbackCreate, user_id: int):
    db_feedback = Feedback(
        **feedback.dict(),
        user_id=user_id
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


def get_feedbacks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Feedback).offset(skip).limit(limit).all()
