import { request } from "../lib/request";

export interface SynthesizeOptions {
  text: string;
  language?: string; // 语言代码，如 "zh-CN", "en-US" 等
  speaker_wav?: string; // 语音模型的 WAV 文件路径或 URL
  speaker?: string | null | undefined; // 语音模型的 ID 或名称
  speed?: number; // 语速
  pitch?: number; // 音调
  volume?: number; // 音量
  format?: string; // 音频格式，如 mp3, wav 等
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
  static async synthesize(options: SynthesizeOptions): Promise<any[]> {
    const data = await request.post("/tts/synthesize", options);
    return data as any;
  }
}
