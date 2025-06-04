from fastapi import Depends, HTTPException, status # Added status
from jose import JWTError, jwt
from auth.auth import oauth2_scheme
from core.security import SECRET_KEY, ALGORITHM
from models.user import User
async def get_current_user(token: str = Depends(oauth2_scheme)):
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
		user_id_str: str = payload.get("sub")
		if user_id_str is None:
			raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="认证失败: Token中缺少用户标识") # More specific error messag
		user_id = int(user_id_str) # Convert user ID string to integer
	except JWTError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="令牌无效") # Use status code constant
	except ValueError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="令牌无效: 用户标识格式错误")
	user = await User.get_or_none(id=user_id) # Query by user ID
	if not user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在") # Use status code constant
	return user

# 你可能还需要一个 get_current_active_user 函数，它在此基础上检查用户是否处于激活状态
# async def get_current_active_user(current_user: User = Depends(get_current_user)):
#     if not current_user.is_active: # 假设 User 模型有 is_active 字段
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="用户未激活")
#     return current_user
