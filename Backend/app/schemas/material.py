from pydantic import BaseModel, Field
from datetime import datetime


class MaterialBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., min_length=1, max_length=10)
    price: float = Field(..., ge=0)


class MaterialCreate(MaterialBase):
    pass


class MaterialUpdate(MaterialBase):
    pass


class MaterialResponse(MaterialBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
