from pydantic import BaseModel, Field
from datetime import datetime


class FeedbackCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)


class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
