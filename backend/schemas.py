
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    last_login: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

# Config schemas
class ConfigCreate(BaseModel):
    config_type: str
    config: Dict[str, Any]

class ConfigResponse(BaseModel):
    id: str
    user_id: str
    config_type: str
    config: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
