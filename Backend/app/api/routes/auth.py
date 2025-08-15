from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

from app.api.deps import get_db
from app.core.security import (
    create_access_token, 
    create_refresh_token, 
    verify_password, 
    oauth2_scheme
)
from app.core.config import settings
from app.crud.user import get_user_by_username, get_user_by_email, create_user
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserLogin, User
from jose import JWTError, jwt

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = get_user_by_email(db, user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        db_user = get_user_by_username(db, user.username)
        if db_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        return create_user(db, user)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user.username)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect user"
        )
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect pass"
        )
    
    access_token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    )
    
    refresh_token = create_refresh_token(
        {"sub": str(db_user.id)}
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired")
    
    new_access_token = create_access_token({"sub": user_id})
    return {"access_token": new_access_token, "refresh_token": refresh_token, "token_type": "bearer"}
