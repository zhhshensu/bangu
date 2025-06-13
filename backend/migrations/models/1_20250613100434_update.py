from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
		ALTER TABLE `voices` ADD `result_file_path` VARCHAR(512) NOT NULL COMMENT '转换后语音文件存储路径';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
		ALTER TABLE `voices` DROP COLUMN `result_file_path`;"""
