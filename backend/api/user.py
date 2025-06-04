from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from models.user import User
from schemas.user import UserOut, UserUpdate, UserCreate
from core.security import create_hash_password
from auth.auth import authenticate_user, create_token_response
from auth.deps import get_current_user

router = APIRouter(prefix="/users", tags=["用户"])

@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    return current_user
@router.get("/{user_id}", response_model=UserOut)
async def read_user(user_id: int):
    user = await User.get_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# 获取所有用户
@router.get("", response_model=List[UserOut])
async def read_users():
  return User.all()

# 更新用户信息
@router.put("/{user_id}", response_model=UserOut)
async def update_user(user_id: int, user: UserUpdate):
  user_obj = await User.get_or_none(id=user_id)
  if not user_obj:
    raise HTTPException(status_code=404, detail="User not found")
  await user_obj.update_from_dict(user.dict(exclude_unset=True)).save()
  return user_obj

# 删除用户
@router.delete("/{user_id}")
async def delete_user(user_id: int):
  user_obj = await User.get_or_none(id=user_id)
  if not user_obj:
    raise HTTPException(status_code=404, detail="User not found")
  await user_obj.delete()
  return {"message": "User deleted"}

