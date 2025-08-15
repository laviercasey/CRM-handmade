from sqlalchemy.orm import Session
from app.models.material import Material
from app.schemas.material import MaterialCreate, MaterialUpdate


def get_material_by_id(db: Session, material_id: int):
    return db.query(Material).filter(Material.id == material_id).first()


def get_materials(db: Session, user_id: int):
    return db.query(Material).filter(Material.user_id == user_id).all()


def create_material(db: Session, material: MaterialCreate, user_id: int):
    db_material = Material(
        **material.dict(),
        user_id=user_id
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material


def update_material(db: Session, material_id: int, material_data: MaterialUpdate):
    db_material = get_material_by_id(db, material_id)
    if not db_material:
        return None
    
    update_data = material_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_material, key, value)
    
    db.commit()
    db.refresh(db_material)
    return db_material


def delete_material(db: Session, material_id: int):
    db_material = get_material_by_id(db, material_id)
    if not db_material:
        return False
    
    db.delete(db_material)
    db.commit()
    return True
