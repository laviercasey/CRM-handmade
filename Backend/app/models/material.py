from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(10), nullable=False)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="materials")
