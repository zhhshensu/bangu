from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS `aerich` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `version` VARCHAR(255) NOT NULL,
    `app` VARCHAR(100) NOT NULL,
    `content` JSON NOT NULL
) CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL UNIQUE COMMENT '用户名',
    `email` VARCHAR(255) UNIQUE COMMENT '邮箱',
    `phone` VARCHAR(20) UNIQUE COMMENT '手机号',
    `hashed_password` VARCHAR(128) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) CHARACTER SET utf8mb4;
CREATE TABLE IF NOT EXISTS `voices` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT COMMENT '用户ID',
    `file_path` VARCHAR(512) NOT NULL COMMENT '转换前语音文件存储路径',
    `result_file_path` VARCHAR(512) NOT NULL COMMENT '转换后语音文件存储路径',
    `original_filename` VARCHAR(255) NOT NULL COMMENT '原始文件名',
    `file_size` INT NOT NULL COMMENT '文件大小，单位字节',
    `upload_date` DATETIME(6) NOT NULL COMMENT '上传日期' DEFAULT CURRENT_TIMESTAMP(6),
    `description` LONGTEXT COMMENT '语音描述'
) CHARACTER SET utf8mb4;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
