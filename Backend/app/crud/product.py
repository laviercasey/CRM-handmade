from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def get_products(db: Session, user_id: int = None):
    query = db.query(Product)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    return query.all()


def create_product(db: Session, product: ProductCreate, user_id: int):
    product_data = product.dict()
    
    db_product = Product(
        **product_data,  
        user_id=user_id  
    )
    
    db.add(db_product)
    
    db.commit()
    
    db.refresh(db_product)
    
    return db_product


def update_product(db: Session, product_id: int, product_data: ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    
    update_data = product_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None: 
            setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return False
    
    db.delete(db_product)
    db.commit()
    return True
