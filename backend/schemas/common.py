from typing import Generic, TypeVar, Optional
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

# Define a generic type variable
T = TypeVar("T")


class ResponseModel(GenericModel, Generic[T]):
    code: int = Field(
        default=20000,
        description="状态码，例如 200 表示成功，400 表示客户端错误，500 表示服务器错误",
    )
    message: str = Field(
        default="Success", description="描述信息，例如 '操作成功', '用户名或密码不正确'"
    )
    data: Optional[T] = Field(
        default=None, description="返回的数据内容，可以是单个对象或列表"
    )
