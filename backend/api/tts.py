import os
import io
import logging
import scipy.io.wavfile as wav
from fastapi import APIRouter, Form, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from services.tts_service import tts_service  # Import the tts_service instance
from typing import Optional, List

router = APIRouter(prefix="/tts", tags=["语音"])


@router.post("/synthesize")
async def synthesize(
    text: str = Form(...),
    speaker_wav: Optional[UploadFile] = File(None),  # 允许上传参考音频
    language: Optional[str] = Form(None),  # 允许指定语言
    speaker: Optional[str] = Form(None),  # 允许指定说话人（如果模型支持语音克隆）
):
    """
    使用 TTS 模型将文本转换为语音，支持语音克隆。
    """
    print(f"Using text: {text}")
    print(
		f"Using speaker_wav: {speaker_wav}, language: {language}, speaker: {speaker}"
	)
    try:
        speaker_wav_path = None
        speaker_name = None
        # 处理上传的音频文件
        if speaker_wav:
            speaker_wav_bytes = await speaker_wav.read()
            # 将上传的文件保存到临时文件
            with open("temp_speaker.wav", "wb") as f:
                f.write(speaker_wav_bytes)
            speaker_wav_path = "temp_speaker.wav"
        else:
            speaker_wav_path = None
        #
        if speaker:
            speaker_name = speaker  # 如果指定了说话人，则不使用上传的音频文件
        else:
            speaker_name = None

        # 文本转换为语音
        wav_output = tts_service.synthesize(
            text=text, speaker_wav=speaker_wav_path, language=language, speaker=speaker
        )

        # 将 NumPy 数组转换为 WAV 格式的字节流
        wav_buffer = io.BytesIO()

        wav.write(wav_buffer, tts_service.sample_rate, wav_output)
        wav_buffer.seek(0)

        # 删除临时文件
        if speaker_wav_path:
            os.remove(speaker_wav_path)

        # 返回语音数据
        return StreamingResponse(wav_buffer, media_type="audio/wav")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
