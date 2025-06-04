import { Button, Input, Select, Space, Typography, message } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;
const { Title, Text } = Typography;

const VoiceClone: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [textToClone, setTextToClone] = useState<string>("");
  const [clonedVoiceName, setClonedVoiceName] = useState<string>("");
  const [cloneStatus, setCloneStatus] = useState<string>("状态：待克隆");

  const handleClone = () => {
    if (!selectedVoice || !textToClone) {
      message.warning("请选择源语音并输入要克隆的文本");
      return;
    }
    setCloneStatus("状态：克隆中...");
    message.success("开始克隆");
    // Simulate API call
    setTimeout(() => {
      setCloneStatus("状态：克隆完成");
      // In a real application, you'd get the cloned audio here
      // For now, just clear inputs
      setSelectedVoice(undefined);
      setTextToClone("");
    }, 2000);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>语音克隆工作室</Title>

      <div style={{ marginBottom: 24, border: "1px solid #f0f0f0", padding: 24 }}>
        <Title level={5}>选择源语音</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>选择已上传的语音素材:</Text>
          <Select
            placeholder="请选择..."
            value={selectedVoice}
            onChange={setSelectedVoice}
            options={[
              { value: "voice1", label: "我的专属声音 V2" },
              { value: "voice2", label: "项目演示声音" },
              { value: "voice3", label: "英文播客声音" },
            ]}
            style={{ width: "100%" }}
          />
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
          {cloneStatus === "状态：克隆完成" && (
            <Text type="success">等待克隆...</Text>
          )}
        </Space>
      </div>
    </div>
  );
};

export default VoiceClone;
