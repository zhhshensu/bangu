import os
import uvicorn
import logging
from fastapi import FastAPI
from api import user as userRoute
from api import auth as authRoute
from api import tts as ttsRoute
from api import voice as voiceRoute
from core.db import init_db
from core.config import settings
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# 加载.env文件
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

app = FastAPI()

# 设置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源，生产环境中应限制为特定的源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有HTTP头
)

# 初始化ORM
init_db(app)
# 注册路由
app.include_router(authRoute.router, prefix=settings.API_V1_STR)
app.include_router(userRoute.router, prefix=settings.API_V1_STR)
app.include_router(ttsRoute.router, prefix=settings.API_V1_STR)
app.include_router(voiceRoute.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    # 从环境变量读取端口，默认8000
    port = int(os.getenv("UVICORN_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
