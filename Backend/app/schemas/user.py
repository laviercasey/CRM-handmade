from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional, Dict, Any, List
from datetime import datetime


class UserBase(BaseModel):
    username: constr(strip_whitespace=True, min_length=3, max_length=50) = Field(..., example="john_doe")


class UserCreate(UserBase):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100, example="John")
    second_name: str = Field(..., min_length=1, max_length=100, example="Doe")
    description: Optional[str] = Field(None)
    password: constr(strip_whitespace=True, min_length=8) = Field(..., example="strong_password")


class UserLogin(UserBase):
    password: constr(strip_whitespace=True, min_length=8) = Field(..., example="strong_password")


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    description: Optional[str] = None
    first_name: Optional[str] = None
    second_name: Optional[str] = None
    avatar: Optional[str] = None
    
    class Config:
        from_attributes = True


class User(UserBase):
    id: int
    first_name: str
    second_name: str
    email: EmailStr
    description: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserInDB(User):
    password_hash: str
    
    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)


class UserExtended(User):
    is_active: bool = True
    is_admin: bool = False
    role: str = "user"
    last_login: Optional[datetime] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    subscription_tier: str = "free"
    subscription_expires: Optional[datetime] = None
    email_verified: bool = False
    preferences: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class UserAdmin(UserExtended):
    login_attempts: int = 0
    account_locked_until: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserExtendedUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    role: Optional[str] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    subscription_tier: Optional[str] = None
    subscription_expires: Optional[datetime] = None
    email_verified: Optional[bool] = None
    preferences: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class UserAdminUpdate(UserExtendedUpdate):
    login_attempts: Optional[int] = None
    account_locked_until: Optional[datetime] = None
    
    class Config:
        from_attributes = True
