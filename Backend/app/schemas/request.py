from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class RequestBase(BaseModel):
    service_name: str = Field(..., max_length=100)
    price: int
    contact_tg: str = Field(..., pattern="^@[a-zA-Z0-9_]{5,32}$")
    description: Optional[str] = Field(None, max_length=500)


class RequestCreate(RequestBase):
    pass


class RequestUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(pending|accepted|rejected|done)$")


class RequestResponse(RequestBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class FormResponse(BaseModel):
    username: str
    first_name: str
    second_name: str
    description: Optional[str]
    user_id: int
