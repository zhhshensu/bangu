from fastapi.security import OAuth2PasswordBearer
from models.user import User
from core.security import ACCESS_TOKEN_EXPIRE_MINUTES, verify_password, create_access_token
from datetime import datetime, timedelta
from typing import Union
from tortoise.queryset import Q

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
# 认证用户
async def authenticate_user(login_identifier: str, password: str) -> Union[User, None]:
	#通过 username, email 或 phone 查找用户
    user = await User.get_or_none(
		Q(username=login_identifier) | Q(email=login_identifier) | Q(phone=login_identifier)
	)
    if user and verify_password(password, user.hashed_password):
        # 你可以在这里添加检查 email_verified 或 phone_verified 的逻辑
        # if not user.email_verified and '@' in login_identifier: # 如果使用邮箱登录但未验证
        #     raise HTTPException(status_code=400, detail="邮箱未验证")
        # if not user.phone_verified and '@' not in login_identifier: # 如果使用手机号登录但未验证
        #     raise HTTPException(status_code=400, detail="手机号未验证")
        return user
    return None

def create_token_response(user: User):
	access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
	access_token = create_access_token(
		data={"sub": user.id}, expires_delta=access_token_expires
	)
	return {"access_token": access_token, "token_type": "bearer"}
