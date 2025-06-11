import torch
import logging
import os
from TTS.api import TTS


class TTSService:
    def __init__(self):
        # 加载 TTS 模型

        try:
            model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
            # model_name = "tts_models/zh-CN/baker/tacotron2-DDC-GST"  # y更换为中文模型
            logging.info(f"cuda is available: {os.path.exists('/dev/nvidia0')}")
            self.tts = TTS(model_name=model_name).to(
                "cuda" if os.path.exists("/dev/nvidia0") else "cpu"
            )  # 根据 GPU 可用性自动选择设备
            logging.info(f"TTS model {model_name} loaded successfully.")
        except Exception as e:
            raise Exception(f"Failed to load TTS model: {e}")

    def synthesize(
        self,
        text: str,
        speaker_wav: str = None,
        language: str = "zh-cn",
        speaker: str = None,
    ):
        """
        使用 TTS 模型将文本转换为语音。
        speaker_wav: 参考音频文件路径，用于语音克隆。
        language: 目标语言，如果未提供，则尝试自动检测。
        """
        try:
            # 文本转换为语音
            wav_output = self.tts.tts(
                text=text, speaker=speaker
            )
            return wav_output
        except Exception as e:
            raise Exception(f"Failed to synthesize: {e}")

    def get_languages(self):
        """
        获取 TTS 模型支持的语言列表。
        """
        try:
            return self.tts.languages
        except Exception as e:
            raise Exception(f"Failed to get languages: {e}")

    def get_speakers(self):
        """
        获取 TTS 模型支持的语音列表。
        """
        try:
            return self.tts.speakers
        except Exception as e:
            raise Exception(f"Failed to get languages: {e}")

    def get_speaker_info(self, speaker_name: str):
        """
        获取指定说话人的信息。
        """
        try:
            if speaker_name in self.tts.speakers:
                return {"speaker_name": speaker_name}
            return None
        except Exception as e:
            raise Exception(f"Failed to get speaker info: {e}")

    @property
    def sample_rate(self):
        if hasattr(self.tts, "synthesizer") and hasattr(
            self.tts.synthesizer, "output_sample_rate"
        ):
            return self.tts.synthesizer.output_sample_rate
        elif hasattr(self.tts, "output_sample_rate"):
            return self.tts.output_sample_rate
        else:
            return 24000  # fallback


# 创建 TTSService 实例 (全局单例)
tts_service = TTSService()
