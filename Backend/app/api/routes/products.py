from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging

from app.api.deps import get_db, get_current_user
from app.crud.product import create_product, get_products, get_product_by_id, update_product, delete_product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.schemas.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", response_model=ProductResponse)
def create_product_route(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return create_product(db, product, current_user.id)
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to create product")


@router.get("", response_model=List[ProductResponse])
def get_products_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return get_products(db, current_user.id)
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get products")


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id_route(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        product = get_product_by_id(db, product_id)
        if not product or product.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException as e:
            raise e
    except Exception as e:
        logger.error(f"Error getting product: {e}")
        raise HTTPException(status_code=500, detail="Failed to get product")


@router.put("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(
    product_id: int,
    product: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_product = get_product_by_id(db, product_id)
        if not db_product or db_product.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Product not found")
        
        updated_product = update_product(db, product_id, product)
        return updated_product
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to update product")


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_endpoint(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db_product = get_product_by_id(db, product_id)
        if not db_product or db_product.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Product not found")
        
        success = delete_product(db, product_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete product")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete product")
