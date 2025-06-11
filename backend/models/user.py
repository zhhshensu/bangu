from tortoise import Tortoise, fields, run_async
from tortoise.models import Model

class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=255, unique=True, description="用户名")
    email = fields.CharField(max_length=255, unique=True, null=True, description="邮箱")
    phone = fields.CharField(max_length=20, unique=True, null=True, description="手机号")
    hashed_password = fields.CharField(max_length=128)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "users"
