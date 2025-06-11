import { Button, Input, Select, Space, Typography, message } from "antd";
import React, { useState } from "react";
import useSpeakers from "../hooks/useSpeakers";
import { VoiceService } from "../services/VoiceService";

const { TextArea } = Input;
const { Title, Text } = Typography;

const VoiceClone: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | undefined>("system");
  const [selectedSystemVoice, setSelectedSystemVoice] = useState<string | undefined>(undefined);
  const [selectedVoiceFile, setSelectedVoiceFile] = useState<string | undefined>(undefined);
  const [textToClone, setTextToClone] = useState<string>("");
  const [clonedVoiceName, setClonedVoiceName] = useState<string>("");
  const [cloneStatus, setCloneStatus] = useState<string>("状态：待克隆");
  const { speakers: speakerList } = useSpeakers();

  const reset = () => {
    setSelectedVoiceFile(undefined);
    setSelectedSystemVoice(undefined);
    setTextToClone("");
  };

  const handleClone = async () => {
    if (selectedType === "system") {
      if (!selectedSystemVoice || !textToClone) {
        message.warning("请选择系统语音并输入要克隆的文本");
        return;
      }
      setCloneStatus("状态：克隆中...");
      message.success("开始克隆");
      try {
        const data = await VoiceService.synthesize({
          text: textToClone,
          language: "zh-cn",
          speaker_wav: undefined,
          speaker: selectedSystemVoice || null,
        });
        console.log(`🚀--Nice ~ handleClone ~ data:`, data);
        setCloneStatus("状态：克隆完成");
        reset();
      } catch (error) {
        console.log(`🚀--Nice ~ handleClone ~ error:`, error);
      }
    }
    if (selectedType === "voiceFile") {
      if (!selectedVoiceFile || !textToClone) {
        message.warning("请选择源语音并输入要克隆的文本");
        return;
      }
      setCloneStatus("状态：克隆中...");
      message.success("开始克隆");
      try {
        const data = await VoiceService.synthesize({
          text: textToClone,
          language: "zh-cn",
          speaker_wav: selectedVoiceFile,
          speaker: null,
        });
        console.log(`🚀--Nice ~ handleClone ~ data:`, data);
        setCloneStatus("状态：克隆完成");
        reset();
      } catch (error) {
        console.log(`🚀--Nice ~ handleClone ~ error:`, error);
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>语音克隆工作室</Title>

      <div style={{ marginBottom: 24, border: "1px solid #f0f0f0", padding: 24 }}>
        <Title level={5}>选择系统语音或源语音</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>选择语音方式:</Text>
          <Select
            placeholder="请选择..."
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: "system", label: "系统预设语音" },
              { value: "voiceFile", label: "语音素材" },
            ]}
            style={{ width: "100%" }}
          />
          {selectedType === "system" && (
            <>
              <Text>选择系统的语音:</Text>
              <Select
                placeholder="请选择语音"
                value={selectedSystemVoice}
                onChange={setSelectedSystemVoice}
                options={speakerList.map((speaker) => ({
                  value: speaker,
                  label: speaker,
                }))}
                style={{ width: "100%" }}
              />
            </>
          )}
          {selectedType === "voiceFile" && (
            <>
              <Text>选择已上传的语音素材:</Text>
              <Select
                placeholder="请选择..."
                value={selectedVoiceFile}
                onChange={setSelectedVoiceFile}
                options={[
                  { value: "voice1", label: "我的专属声音 V2" },
                  { value: "voice2", label: "项目演示声音" },
                  { value: "voice3", label: "英文播客声音" },
                ]}
                style={{ width: "100%" }}
              />
            </>
          )}

          <Text>输入要克隆的文本:</Text>
          <TextArea
            rows={4}
            placeholder="请输入您希望克隆语音朗读的文本..."
            value={textToClone}
            onChange={(e) => setTextToClone(e.target.value)}
          />
          <Button type="primary" onClick={handleClone}>
            开始克隆
          </Button>
        </Space>
      </div>

      <div style={{ border: "1px solid #f0f0f0", padding: 24 }}>
        <Title level={5}>克隆结果预览</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>克隆语音名称:</Text>
          <Input
            placeholder="请输入克隆语音的名称"
            value={clonedVoiceName}
            onChange={(e) => setClonedVoiceName(e.target.value)}
          />
          <Text>克隆语音预览</Text>
          <Text>{cloneStatus}</Text>
          {cloneStatus === "状态：克隆完成" && <Text type="success">等待克隆...</Text>}
        </Space>
      </div>
    </div>
  );
};

export default VoiceClone;
