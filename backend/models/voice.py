from tortoise import fields
from tortoise.models import Model


class Voice(Model):
    id = fields.IntField(pk=True)
    user_id = fields.IntField(null=True, description="用户ID")
    file_path = fields.CharField(
        max_length=512, description="转换前语音文件存储路径"
    )
    result_file_path = fields.CharField(
        max_length=512, description="转换后语音文件存储路径"
    )
    original_filename = fields.CharField(max_length=255, description="原始文件名")
    file_size = fields.IntField(description="文件大小，单位字节")
    upload_date = fields.DatetimeField(auto_now_add=True, description="上传日期")
    description = fields.TextField(null=True, description="语音描述")

    class Meta:
        table = "voices"
