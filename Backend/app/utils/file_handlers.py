import os
import shutil
import logging
from pathlib import Path
from typing import List, Optional
from fastapi import UploadFile, HTTPException
from datetime import datetime

from app.core.config import settings

logger = logging.getLogger(__name__)

def is_valid_image(filename: str, content_type: str) -> bool:
    if not content_type.startswith("image/"):
        return False
    
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    file_extension = os.path.splitext(filename)[1].lower()
    
    return file_extension in allowed_extensions


def save_upload_file(
    upload_file: UploadFile,
    destination: Path,
    filename: Optional[str] = None,
    user_id: Optional[int] = None,
    prefix: str = "",
) -> str:
    try:
        destination.mkdir(parents=True, exist_ok=True)
        
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_extension = os.path.splitext(upload_file.filename)[1].lower()
            
            if user_id:
                filename = f"{prefix}{user_id}_{timestamp}{file_extension}"
            else:
                filename = f"{prefix}{timestamp}{file_extension}"
        
        file_path = destination / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        return filename
    
    except Exception as e:
        logger.error(f"Error saving file {upload_file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


def delete_file(file_path: Path) -> bool:
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        logger.error(f"Error deleting file {file_path}: {e}")
        return False


def get_avatar_path(avatar_filename: str) -> Path:
    return settings.AVATAR_DIR / avatar_filename


def get_upload_path(filename: str) -> Path:
    return settings.UPLOAD_DIR / filename
