from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import logging
import shutil
import os
from pathlib import Path
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.crud.user import get_user_by_id
from app.core.config import settings
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/avatar", response_model=dict)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"File extension must be one of: {', '.join(allowed_extensions)}"
            )
        
        filename = f"avatar_{current_user.id}_{timestamp}{file_extension}"
        file_path = settings.AVATAR_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        db_user = get_user_by_id(db, current_user.id)
        
        if db_user.avatar:
            old_avatar_path = settings.AVATAR_DIR / db_user.avatar
            if os.path.exists(old_avatar_path):
                os.remove(old_avatar_path)
        
        return {
            "filename": filename,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading avatar: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload avatar")


@router.post("", response_model=dict)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{current_user.id}_{datetime.now().timestamp()}.{file_extension}"
        file_path = settings.UPLOAD_DIR / unique_filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {"filename": unique_filename}
    except Exception as e:  
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file")
