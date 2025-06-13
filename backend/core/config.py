class Settings:
    API_V1_STR = "/api/v1"
    SECRET_KEY = "a_very_secret_key_that_should_be_changed_in_production"
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 8
    PROJECT_NAME = "Bangu Backend"

    # Database
    # SQLALCHEMY_DATABASE_URL: str = "sqlite:///./sql_app.db" # Example for SQLite
    # SQLALCHEMY_DATABASE_URL: str = "postgresql://user:password@host:port/database" # Example for PostgreSQL
    # For Tortoise ORM, connection details are in TORTOISE_ORM, but you might have other DB related settings here.

    # CORS
    BACKEND_CORS_ORIGINS = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:8080",
    ]


settings = Settings()

TORTOISE_ORM = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.mysql",
            "credentials": {
                "host": "localhost",
                "port": 3306,
                "user": "root",
                "password": "szh1234567",
                "database": "fastapi_test",
                "minsize": 1,  # 连接池最小连接数
                "maxsize": 5,  # 连接池最大连接数
                "charset": "utf8mb4",  # 字符集
            },
        }
    },
    "apps": {
        "models": {
            "models": ["aerich.models", "models.user", "models.voice"],  # 模型路径
            "default_connection": "default",
        }
    },
    "use_tz": False,  # 关闭时区支持
    "timezone": "Asia/Shanghai",
}
