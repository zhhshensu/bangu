from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from tortoise.queryset import Q

from core import security
from models.user import User
from schemas.common import ResponseModel
from schemas.user import UserCreate, UserOut
from schemas.token import Token
from auth.auth import authenticate_user, create_access_token
from core.security import create_access_token, create_hash_password
from auth.deps import get_current_user
from core.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/register", response_model=UserOut, summary="用户注册")
async def register_user(user_in: UserCreate):
    """
    创建新用户。
    - **username**: 必需，唯一的用户名。
    - **password**: 必需，用户密码。
    - **email**: 可选，唯一的邮箱地址。
    - **phone**: 可选，唯一的手机号码。
    """
    existing_user = await User.get_or_none(username=user_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="用户名已被注册"
        )
    if user_in.email:
        existing_user_by_email = await User.get_or_none(email=user_in.email)
        if existing_user_by_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="邮箱已被注册"
            )
    if user_in.phone:
        existing_user_by_phone = await User.get_or_none(phone=user_in.phone)
        if existing_user_by_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="手机号已被注册"
            )

    hashed_password = create_hash_password(user_in.password)
    db_user = await User.create(
        username=user_in.username,
        hashed_password=hashed_password,
        email=user_in.email,
        phone=user_in.phone,
        # 默认新注册用户邮箱和手机未验证
        email_verified=False,
        phone_verified=False,
    )
    return db_user


@router.post("/login", response_model=ResponseModel[Token], summary="用户登录")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    通过用户名/邮箱/手机号和密码获取访问令牌。
    """
    logging.info(f"Login attempt for: {form_data}")
    # authenticate_user now directly uses Tortoise ORM and doesn't need db session
    user = await authenticate_user(
        login_identifier=form_data.username, password=form_data.password
    )
    if not user:
        return ResponseModel(
            code=20001,
            data=None,
            message="用户名或密码不正确",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return ResponseModel(
        data={"access_token": access_token, "token_type": "bearer"},
        message="登录成功",
    )


@router.post("/logout", response_model=ResponseModel, summary="用户登出")
async def logout(current_user: User = Depends(get_current_user)):
    """
    用户登出。
    实际的登出逻辑通常在客户端通过删除token实现。
    后端可以考虑将token加入黑名单（如果需要更严格的控制）。
    """
    # 这里可以添加将token加入黑名单的逻辑，如果你的系统需要的话
    # 例如: await add_token_to_blacklist(token)

    logging.info(f"User {current_user.username} logged out successfully.")
    return ResponseModel(message="登出成功")
