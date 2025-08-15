from sqlalchemy import Column, String, Text, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    username = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)   
    second_name = Column(String(100), nullable=False)  
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)          
    avatar = Column(String(255), nullable=True)  # Поле для хранения пути к аватару
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="owner")
    requests = relationship("Request", back_populates="owner")
    materials = relationship("Material", back_populates="owner")
    feedbacks = relationship("Feedback", back_populates="owner")



# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
#     username = Column(String(50), unique=True, nullable=False)
#     first_name = Column(String(100), nullable=False)   
#     second_name = Column(String(100), nullable=False)  
#     email = Column(String(255), unique=True, nullable=False)
#     password_hash = Column(String(255), nullable=False)
#     description = Column(Text, nullable=True)          
#     avatar = Column(String(255), nullable=True)  # Поле для хранения пути к аватару
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
    
#     # Поля для админ-панели и расширений
#     is_active = Column(Boolean, default=True)  # Активен ли пользователь
#     is_admin = Column(Boolean, default=False)  # Является ли пользователь администратором
#     role = Column(Enum("user", "manager", "admin", "superadmin", name="role_enum"), default="user")  # Роль пользователя
#     last_login = Column(DateTime(timezone=True), nullable=True)  # Время последнего входа
#     phone_number = Column(String(20), nullable=True)  # Номер телефона
#     company_name = Column(String(100), nullable=True)  # Название компании (для бизнес-аккаунтов)
#     subscription_tier = Column(Enum("free", "basic", "premium", "enterprise", name="subscription_enum"), default="free")  # Уровень подписки
#     subscription_expires = Column(DateTime(timezone=True), nullable=True)  # Дата окончания подписки
#     email_verified = Column(Boolean, default=False)  # Подтвержден ли email
#     email_verification_token = Column(String(255), nullable=True)  # Токен для подтверждения email
#     password_reset_token = Column(String(255), nullable=True)  # Токен для сброса пароля
#     password_reset_expires = Column(DateTime(timezone=True), nullable=True)  # Срок действия токена сброса пароля
#     login_attempts = Column(Integer, default=0)  # Количество неудачных попыток входа
#     account_locked_until = Column(DateTime(timezone=True), nullable=True)  # Время блокировки аккаунта
#     preferences = Column(Text, nullable=True)  # JSON с настройками пользователя
    
#     products = relationship("Product", back_populates="owner")
#     requests = relationship("Request", back_populates="owner")
#     materials = relationship("Material", back_populates="owner")
#     feedbacks = relationship("Feedback", back_populates="owner")
    
#     def is_superuser(self):
#         return self.role == "superadmin"
    
#     def has_role(self, role):
#         roles_hierarchy = {
#             "user": 1,
#             "manager": 2,
#             "admin": 3,
#             "superadmin": 4
#         }
#         user_role_level = roles_hierarchy.get(self.role, 0)
#         required_role_level = roles_hierarchy.get(role, 0)
#         return user_role_level >= required_role_level
    
#     def is_subscription_active(self):
#         if self.subscription_tier == "free":
#             return True
#         if not self.subscription_expires:
#             return False
#         return self.subscription_expires > func.now()
    
#     def can_access_feature(self, feature):
#         feature_access = {
#             "free": ["basic_analytics", "limited_products"],
#             "basic": ["basic_analytics", "limited_products", "export_csv"],
#             "premium": ["advanced_analytics", "unlimited_products", "export_csv", "export_excel"],
#             "enterprise": ["advanced_analytics", "unlimited_products", "export_csv", "export_excel", "api_access", "custom_branding"]
#         }
        
#         if self.is_admin:
#             return True
            
#         if not self.is_subscription_active():
#             return feature in feature_access["free"]
            
#         return feature in feature_access.get(self.subscription_tier, [])
