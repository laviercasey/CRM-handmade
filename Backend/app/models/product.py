from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    img_name = Column(String)
    description = Column(String)
    price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="products")
