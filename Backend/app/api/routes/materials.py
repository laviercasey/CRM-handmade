from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.api.deps import get_db, get_current_user
from app.crud.material import get_materials, create_material, get_material_by_id, update_material, delete_material
from app.schemas.material import MaterialCreate, MaterialResponse, MaterialUpdate
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("", response_model=List[MaterialResponse])
def get_materials_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_materials(db, current_user.id)
    except Exception as e:
        logger.error(f"Error getting materials: {e}")
        raise HTTPException(status_code=500, detail="Failed to get materials")


@router.post("", response_model=MaterialResponse)
def create_material_route(
    material: MaterialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return create_material(db, material, current_user.id)
    except Exception as e:
        logger.error(f"Error creating material: {e}")
        raise HTTPException(status_code=500, detail="Failed to create material")


@router.patch("/{material_id}", response_model=MaterialResponse)
def update_material_route(
    material_id: int,
    material: MaterialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_material = get_material_by_id(db, material_id)
        if not db_material or db_material.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Material not found")
        
        return update_material(db, material_id, material)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error updating material: {e}")
        raise HTTPException(status_code=500, detail="Failed to update material")


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material_route(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_material = get_material_by_id(db, material_id)
        if not db_material or db_material.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Material not found")
        
        success = delete_material(db, material_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete material")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error deleting material: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete material")
