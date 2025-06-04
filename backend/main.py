import os
import uvicorn
from fastapi import FastAPI
from api import user as userRoute
from api import auth as authRoute
from core.db import init_db
from core.config import settings
from dotenv import load_dotenv
# 加载.env文件
load_dotenv()

app = FastAPI()

# 初始化ORM
init_db(app)
# 注册路由
app.include_router(authRoute.router, prefix=settings.API_V1_STR)
app.include_router(userRoute.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    # 从环境变量读取端口，默认8000
    port = int(os.getenv("UVICORN_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
