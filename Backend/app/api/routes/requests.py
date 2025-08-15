from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.api.deps import get_db, get_current_user
from app.crud.request import create_request, get_requests, get_request_by_id, update_request_status
from app.crud.user import get_user_by_username
from app.schemas.request import RequestCreate, RequestResponse, RequestUpdate, FormResponse
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", response_model=RequestResponse)
def create_request_authenticated(
    request: RequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_request(db, request, current_user.id)


@router.get("", response_model=List[RequestResponse])
def read_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_requests(db, current_user.id, skip, limit, status)


@router.patch("/{request_id}", response_model=RequestResponse)
def update_request_status_route(
    request_id: int,  
    status_update: RequestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_request = get_request_by_id(db, request_id)
        if not db_request or db_request.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Request not found")
        
        return update_request_status(db, request_id, status_update.status)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error updating request status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update request status")


@router.get("/forms/{username}", response_model=FormResponse)
def get_form_data(
    username: str,
    db: Session = Depends(get_db)
):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="Form not found")
    
    return {
        "username": user.username,
        "first_name": user.first_name,
        "second_name": user.second_name,
        "description": user.description,
        "user_id": user.id
    }


@router.post("/forms/{username}", response_model=RequestResponse)
def create_request_via_form(
    username: str,
    request: RequestCreate,
    db: Session = Depends(get_db)
):
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="Form not found")
    
    return create_request(db, request, user.id)
