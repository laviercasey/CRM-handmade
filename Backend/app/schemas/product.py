from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    img_name: str
    description: str
    price: float = Field(..., ge=0)


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    img_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)

    class Config:
        from_attributes = True
