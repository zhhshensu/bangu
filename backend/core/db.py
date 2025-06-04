from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
from core.config import TORTOISE_ORM

def init_db(app: FastAPI):
    # register_tortoise(
    #     app,
    #     db_url="sqlite://db.sqlite3", # 可替换为mysql/postgresql等
    #     modules={"models": ["models.user"]}, # 指定模型所在位置
    #     generate_schemas=True, # 自动创建数据库表
    #     add_exception_handlers=True, # 自动添加异常处理
    # )
    # 使用配置文件
    register_tortoise(
        app,
        config=TORTOISE_ORM, # 配置
        generate_schemas=True, # 自动创建数据库表
        add_exception_handlers=True, # 自动添加异常处理
    )