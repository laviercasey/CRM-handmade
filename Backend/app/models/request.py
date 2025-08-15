from sqlalchemy import Column, String, Text, ForeignKey, Integer, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum("pending", "accepted", "rejected", "done", name="status_enum"), default="pending")
    service_name = Column(String)
    price = Column(Integer)
    contact_tg = Column(String)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="requests")
