from typing import Optional
import requests
import logging
import os
from fastapi import UploadFile

logging.basicConfig(level=logging.INFO)


class TTSService:
    def __init__(self):
        self.spark_tts_base_url = os.getenv("SPARK_TTS_URL", "http://localhost:9001")
        self.synthesize_endpoint = f"{self.spark_tts_base_url}/tts/clone"
        self.languages_endpoint = f"{self.spark_tts_base_url}/languages"
        self.speakers_endpoint = f"{self.spark_tts_base_url}/speakers"
        self.speaker_info_endpoint = f"{self.spark_tts_base_url}/speakers"
        self.model_name_endpoint = f"{self.spark_tts_base_url}/model_name"
        logging.info(
            f"Initialized TTSService for Spark-TTS at {self.spark_tts_base_url}"
        )

    def synthesize(
        self,
        text: str,
        prompt_speech_path: str = None,
        prompt_text: str = None,
    ):
        """
        使用 Spark-TTS 服务将文本转换为语音。
        prompt_speech_path: 参考音频文件路径，用于语音克隆。
        prompt_text: 额外的文本提示。
        """
        try:
            data = {"text": text}
            files = {}

            if prompt_text:
                data["prompt_text"] = prompt_text

            if prompt_speech_path:
                # 检查文件是否存在
                with open(prompt_speech_path, "rb") as f:
                    files["prompt_speech"] = (
                        os.path.basename(prompt_speech_path),
                        f.read(),
                        "audio/wav",
                    )
            response = requests.post(self.synthesize_endpoint, data=data, files=files)
            response.raise_for_status()
            return response.content
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error calling Spark-TTS synthesize service: {e}")
        except Exception as e:
            raise Exception(f"Failed to synthesize speech with Spark-TTS: {e}")

    def get_languages(self):
        """
        获取 Spark-TTS 服务支持的语言列表。
        """
        try:
            response = requests.get(self.languages_endpoint)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.warning(
                f"Could not retrieve languages from Spark-TTS: {e}. Returning empty list."
            )
            return []
        except Exception as e:
            raise Exception(f"Failed to get languages from Spark-TTS: {e}")

    def get_speakers(self):
        """
        获取 Spark-TTS 服务支持的语音列表。
        """
        try:
            response = requests.get(self.speakers_endpoint)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.warning(
                f"Could not retrieve speakers from Spark-TTS: {e}. Returning empty list."
            )
            return []
        except Exception as e:
            raise Exception(f"Failed to get speakers from Spark-TTS: {e}")

    def get_speaker_info(self, speaker_name: str):
        """
        获取指定说话人的信息。
        """
        try:
            response = requests.get(f"{self.speaker_info_endpoint}/{speaker_name}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.warning(
                f"Could not retrieve speaker info for {speaker_name} from Spark-TTS: {e}. Returning None."
            )
            return None
        except Exception as e:
            raise Exception(f"Failed to get speaker info from Spark-TTS: {e}")

    def get_model_name(self):
        """
        获取当前使用的模型名称 (Spark-TTS)。
        """
        try:
            response = requests.get(self.model_name_endpoint)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.warning(
                f"Could not retrieve model name from Spark-TTS: {e}. Returning default."
            )
            return {"model_name": "Spark-TTS Service"}
        except Exception as e:
            raise Exception(f"Failed to get model name from Spark-TTS: {e}")

    @property
    def sample_rate(self):
        return 22050


# 创建 TTSService 实例 (全局单例)
tts_service = TTSService()
