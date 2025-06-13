import { request } from "../lib/request";

export interface SynthesizeOptions {
  text: string;
  prompt_text?: string; // 提示词文本
  prompt_speech?: File; // 语音模型的 WAV
  prompt_speech_path?: string; // 语音模型的 WAV 路劲
  voice_id?: string; // 语音模型ID
}

export interface VoiceUploadOptions {
  file: File; // 上传的音频文件
  description?: string; // 音频描述
}

export interface VoiceListOptions {}

export interface VoiceListItem {
  id: string | number;
  user_id: string | number;
  file_path: string;
  result_file_path?: string;
  original_filename: string;
  file_size: number;
  upload_date: Date;
  description?: string;
}

export class VoiceService {
  static async getSpeakers(): Promise<any[]> {
    const data = await request.get("/tts/speakers");
    return data as any;
  }
  static async getSpeakerInfo(speakerId: string): Promise<any> {
    const data = await request.get(`/tts/speakers/${speakerId}`);
    return data as any;
  }
  /**
   * 克隆语音
   * @returns
   */
  static async synthesize(options: SynthesizeOptions): Promise<any> {
    const response: any = await request.post("/tts/synthesize", options, {
      responseType: "blob", // 设置响应类型为 blob，以便处理音频文件
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const audioBlob = new Blob([response.data], { type: "audio/wav" });
    const url = URL.createObjectURL(audioBlob);
    return url;
  }

  /**
   * 语音上传
   * @returns
   */
  static async upload(options: VoiceUploadOptions): Promise<any> {
    const data: any = await request.post("/voice/upload", options, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  /**
   * 语音列表
   * @returns
   */
  static async list(options = {}): Promise<{ total: number; items: VoiceListItem[] }> {
    const data: any = await request.post("/voice", options);
    return data;
  }

  /**
   * 语音列表
   * @returns
   */
  static async delete(voice_id: number | string): Promise<any> {
    const data: any = await request.delete(`/voice/${voice_id}`, { params: {} });
    return data;
  }
}
