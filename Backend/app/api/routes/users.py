from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.api.deps import get_db, get_current_user
from app.crud.user import update_user, delete_user, get_user_by_id
from app.core.security import verify_password, get_password_hash
from app.schemas.user import User, UserUpdate, PasswordChange

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/me", response_model=User)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=User)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_user(db, current_user.id, user_update)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    delete_user(db, current_user.id)


@router.post("/me/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_user = get_user_by_id(db, current_user.id)
        if not verify_password(password_data.current_password, db_user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect current password")
        
        hashed_password = get_password_hash(password_data.new_password)    
        db_user.password_hash = hashed_password
        db.commit()
        
        return {"message": "Password changed successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error changing password: {e}")
        raise HTTPException(status_code=500, detail="Failed to change password")
