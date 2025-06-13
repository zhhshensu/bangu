import os
import io
import logging
import scipy.io.wavfile as wav
from fastapi import APIRouter, Form, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from services.tts_service import tts_service  # Import the tts_service instance
from typing import Optional, List
import shutil  # For file operations
from pathlib import Path
from datetime import datetime
from models.voice import Voice  # 新增导入
from tortoise.transactions import in_transaction  # 新增导入

logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/tts", tags=["克隆"])


@router.post("/synthesize")
async def synthesize(
    text: str = Form(...),
    prompt_text: Optional[str] = Form(None),  # 允许指定额外的文本提示
    prompt_speech: Optional[UploadFile] = File(None),
    prompt_speech_path: Optional[str] = Form(None),
    voice_id: Optional[int] = Form(None),  # 新增参数
):
    """
    使用 TTS 模型将文本转换为语音，支持语音克隆。
    如果提供voice_id，则将生成的语音路径写入voices表的result_file_path字段。
    """
    logging.info(f"Using text: {text}")
    logging.info(f"Using prompt_text: {prompt_text}, prompt_speech: {prompt_speech}")
    # Generate unique filename using timestamp
    timestamp = datetime.now().strftime(
        "%Y%m%d%H%M%S%f"
    )  # Added %f for microsecond to ensure uniqueness
    speech_path = prompt_speech_path
    temp_speech_path = None  # 临时文件目录
    try:
        # 处理上传的音频文件
        if prompt_speech:
            # Save the uploaded file temporarily
            temp_file_name = f"temp_{prompt_speech.filename}"
            temp_speech_path = Path("temp_uploads") / temp_file_name
            os.makedirs(
                Path("temp_uploads"), exist_ok=True
            )  # Ensure temp directory exists
            with open(temp_speech_path, "wb") as buffer:
                shutil.copyfileobj(prompt_speech.file, buffer)
            speech_path = str(temp_speech_path)
            logging.info(f"Prompt speech saved temporarily to: {speech_path}")

        # 文本转换为语音
        wav_output = tts_service.synthesize(
            text=text, prompt_speech_path=speech_path, prompt_text=prompt_text
        )

        # --- New code to save to results directory ---
        results_dir = "./results"
        os.makedirs(results_dir, exist_ok=True)

        unique_filename = f"{timestamp}.wav"
        file_path = os.path.join(results_dir, unique_filename)

        with open(file_path, "wb") as f:
            f.write(wav_output)
        logging.info(f"Synthesized audio saved to: {file_path}")
        # --- End new code ---

        # 新增：写入voices表
        if voice_id is not None:
            async with in_transaction():
                voice = await Voice.filter(id=voice_id).first()
                if voice:
                    voice.result_file_path = file_path
                    await voice.save()
                    logging.info(
                        f"Updated voice id={voice_id} with result_file_path={file_path}"
                    )
                else:
                    logging.warning(
                        f"Voice id={voice_id} not found, cannot update result_file_path."
                    )

        # 返回语音数据
        return FileResponse(
            path=file_path, media_type="audio/wav", filename=timestamp + ".wav"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_speech_path and os.path.exists(temp_speech_path):
            os.remove(temp_speech_path)  # Clean up the temporary file


@router.get("/languages")
async def get_languages():
    """
    获取 TTS 模型支持的语言列表。
    """
    try:
        languages = tts_service.get_languages()
        if not isinstance(languages, list):
            languages = list(languages) if hasattr(languages, "__iter__") else []
        return JSONResponse(content=languages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/speakers")
async def get_speakers():
    """
    获取 TTS 模型支持的语音列表。
    """
    try:
        speakers = tts_service.get_speakers()
        # Ensure speakers is a list for JSON serialization
        if not isinstance(speakers, list):
            # If it's iterable, convert to list. Otherwise, default to empty list.
            speakers = list(speakers) if hasattr(speakers, "__iter__") else []
        return JSONResponse(content=speakers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/speakers/{speaker_name}")
async def get_speaker_info(speaker_name: str):
    """
    获取指定说话人的信息。
    """
    try:
        speaker_info = tts_service.get_speaker_info(speaker_name)
        if speaker_info:
            return JSONResponse(content=speaker_info)
        else:
            raise HTTPException(status_code=404, detail="Speaker not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model_name")
async def get_model_name():
    """
    获取当前使用的模型名称
    """
    try:
        model_name = tts_service.get_model_name()
        return JSONResponse(content={"model_name": model_name})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
