from fastapi import (
    APIRouter,
    Form,
    UploadFile,
    File,
    Depends,
    HTTPException,
    status,
    Query,
)
from tortoise.transactions import in_transaction
from pathlib import Path
import os
import shutil
from typing import List, Optional

from models.voice import Voice
from schemas.common import ResponseModel
from schemas.voice import VoiceCreate, VoiceResponse, VoiceListResponse
from auth.deps import (
    get_current_user,
)  # Assuming this exists for user authentication
from models.user import User
import logging
from tortoise.timezone import now

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter(prefix="/voice", tags=["语音仓库"])

UPLOAD_DIR = "./uploads/voices"


@router.post(
    "/upload",
    response_model=ResponseModel[VoiceResponse],
    status_code=status.HTTP_200_OK,
)
async def upload_voice(
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),  # Assuming user authentication
):
    """
    Uploads a voice file and saves its metadata to the database.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_location = Path(UPLOAD_DIR) / file.filename
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        async with in_transaction():
            existing_voice = await Voice.filter(
                original_filename=file.filename, user_id=current_user.id
            ).first()

            if existing_voice:
                # Update existing voice
                existing_voice.file_path = str(file_location)
                existing_voice.file_size = file.size
                existing_voice.description = description
                existing_voice.upload_date = now()
                await existing_voice.save()
                voice = existing_voice
            else:
                # Create new voice
                voice_data = {
                    "user_id": current_user.id,
                    "file_path": str(file_location),
                    "original_filename": file.filename,
                    "file_size": file.size,
                    "description": description,
                }
                voice = await Voice.create(**voice_data)
            return ResponseModel(data=VoiceResponse.model_validate(voice))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload voice file: {e}")
    finally:
        file.file.close()


@router.get("/{voice_id}", response_model=ResponseModel[VoiceResponse])
async def get_voice_by_id(
    voice_id: int, current_user: User = Depends(get_current_user)
):
    """
    Retrieves metadata for a specific voice file by ID.
    """
    voice = await Voice.filter(id=voice_id, user_id=current_user.id).first()
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found or access denied")
    return ResponseModel(data=VoiceResponse.model_validate(voice))


@router.post("/", response_model=ResponseModel[VoiceListResponse])
async def list_voices(
    skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user)
):
    """
    Retrieves a list of all voice file metadata for the current user.
    """
    total = await Voice.filter(user_id=current_user.id).count()
    voices = await Voice.filter(user_id=current_user.id).offset(skip).limit(limit).all()
    return ResponseModel(
        data={
            "total": total,
            "items": [VoiceResponse.model_validate(voice) for voice in voices],
        }
    )


@router.delete(
    "/{voice_id}", response_model=ResponseModel[None], status_code=status.HTTP_200_OK
)
async def delete_voice(voice_id: int, current_user: User = Depends(get_current_user)):
    """
    Deletes a specific voice file by ID for the current user, including file removal from disk and database.
    """
    voice = await Voice.filter(id=voice_id, user_id=current_user.id).first()
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found or access denied")
    # Delete the file from disk
    try:
        if voice.file_path and os.path.exists(voice.file_path):
            os.remove(voice.file_path)
        if voice.result_file_path and os.path.exists(voice.result_file_path):
            os.remove(voice.result_file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {e}")
    # Delete the database record
    await voice.delete()
    return ResponseModel(message="Voice deleted successfully", data=None)
