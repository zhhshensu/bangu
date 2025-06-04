## Pydantic 请求 / 响应模型

from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: Optional[str] = None # 用户名可以设为可选，如果主要通过邮箱/手机号注册
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    # 注册时，可以只要求邮箱或手机号之一，或者都要求
    # 例如，如果要求邮箱必填：
    # email: EmailStr

class UserUpdate(UserBase):
    email_verified: Optional[bool] = None
    phone_verified: Optional[bool] = None
    # 可以添加修改密码的逻辑

class UserOut(UserBase):
    id: int
    email_verified: bool
    phone_verified: bool

    class Config:
        from_attributes = True # orm_mode for Pydantic V1

