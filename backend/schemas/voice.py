from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class VoiceBase(BaseModel):
    description: Optional[str] = None


class VoiceCreate(VoiceBase):
    original_filename: str
    file_size: int
    file_path: str
    user_id: Optional[int] = None


class VoiceResponse(VoiceBase):
    id: int
    user_id: Optional[int]
    file_path: str
    original_filename: str
    result_file_path: Optional[str] = None
    file_size: int
    upload_date: datetime

    class Config:
        from_attributes = True


class VoiceListResponse(BaseModel):
    total: int
    items: List[VoiceResponse]
