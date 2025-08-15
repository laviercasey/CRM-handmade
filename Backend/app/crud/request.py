from sqlalchemy.orm import Session
from app.models.request import Request
from app.schemas.request import RequestCreate


def create_request(db: Session, request: RequestCreate, user_id: int):
    db_request = Request(
        **request.dict(),
        user_id=user_id,
        status="pending"
    )   
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def get_requests(db: Session, user_id: int, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(Request).filter(Request.user_id == user_id)
    if status:
        query = query.filter(Request.status == status)
    return query.offset(skip).limit(limit).all()


def get_request_by_id(db: Session, request_id: int):
    return db.query(Request).filter(Request.id == request_id).first()


def update_request_status(db: Session, request_id: int, new_status: str):
    db_request = get_request_by_id(db, request_id)
    db_request.status = new_status
    db.commit()
    db.refresh(db_request)
    return db_request
