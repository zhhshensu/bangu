import { App, Button, Input, Select, Space, Spin, Typography, Upload, message } from "antd";
import React, { useState } from "react";
import useSpeakers from "../hooks/useSpeakers";
import { VoiceListItem, VoiceService } from "../services/VoiceService";
import useVoice from "../hooks/useVoice";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Dragger } = Upload;

const VoiceClone: React.FC = () => {
  const { message, modal, notification } = App.useApp();
  const [selectedType, setSelectedType] = useState<"system" | "localFile">("system");
  const [selectedSystemVoice, setSelectedSystemVoice] = useState<string | undefined>(undefined); // 选择上传的语音库文件
  const [selectedSystemVoicePath, setSelectedSystemVoicePath] = useState<string | undefined>(
    undefined
  ); // 选择上传的语音库文件路径
  const [fileList, setFileList] = useState<any[]>([]); // 选择本地文件

  const [textToClone, setTextToClone] = useState<string>("");
  const [clonedVoiceName, setClonedVoiceName] = useState<string>("");
  const [cloneStatus, setCloneStatus] = useState<string>("状态：待克隆");

  const [cloneAudioUrl, setCloneAudioUrl] = useState<string | null>(null);
  const [cloneLoading, setCloneLoading] = useState<boolean>(false);

  const { voices: voicesList, total: voicesTotal } = useVoice();

  const props: UploadProps = {
    name: "file",
    multiple: true,
    maxCount: 1,
    accept: ".mp3,.wav,.flac",
    beforeUpload: (file) => {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("单个文件最大50MB!");
      }
      if (fileList.length >= 1) {
        message.error("只能上传一个文件");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevent default upload behavior
    },
    onRemove: (file) => {
      setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    },
    fileList,
    showUploadList: true,
  };

  const reset = () => {
    setSelectedSystemVoice(undefined);
    setTextToClone("");
    setCloneAudioUrl(null);
    setCloneStatus("状态：待克隆");
    setFileList([]);
  };

  const handleClone = async () => {
    if (selectedType === "system") {
      if (!selectedSystemVoice || !textToClone) {
        message.warning("请选择系统语音并输入要克隆的文本");
        return;
      }
      setCloneLoading(true);
      setCloneStatus("状态：克隆中...");
      message.success("开始克隆");
      try {
        const data = await VoiceService.synthesize({
          text: textToClone,
          prompt_text: "",
          prompt_speech: undefined,
          prompt_speech_path: selectedSystemVoicePath,
          voice_id: selectedSystemVoice,
        });
        setCloneAudioUrl(data);
        setCloneStatus("状态：克隆完成");
      } catch (error) {
      } finally {
        setCloneLoading(false);
      }
    }
    if (selectedType === "localFile") {
      if (!(fileList.length > 0) || !textToClone) {
        message.warning("请选择源语音并输入要克隆的文本");
        return;
      }
      setCloneLoading(true);
      setCloneStatus("状态：克隆中...");
      message.success("开始克隆");
      try {
        const data = await VoiceService.synthesize({
          text: textToClone,
          prompt_text: "",
          prompt_speech: fileList[0],
          prompt_speech_path: undefined,
        });
        setCloneAudioUrl(data);
        setCloneStatus("状态：克隆完成");
      } catch (error) {
      } finally {
        setCloneLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>语音克隆工作室</Title>

      <Spin spinning={cloneLoading}>
        <div style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 16 }}>
          <Text type="secondary">
            通过克隆语音，您可以创建一个与您提供的源语音相似的语音模型。支持从语音库或本地文件上传。
          </Text>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>选择语音方式:</Text>
            <Select
              placeholder="请选择..."
              value={selectedType}
              onChange={(key) => {
                setSelectedType(key);
                reset();
              }}
              options={[
                { value: "system", label: "语音库" },
                { value: "localFile", label: "本地文件" },
              ]}
              style={{ width: "100%" }}
            />
            {selectedType === "system" && (
              <>
                <Text>选择语音库文件:</Text>
                <Select
                  placeholder="请选择..."
                  value={selectedSystemVoice}
                  onChange={(key: any) => {
                    const target = voicesList.find((item: VoiceListItem) => item.id === key);
                    setSelectedSystemVoice(key);
                    setSelectedSystemVoicePath(target?.file_path || "");
                  }}
                  options={voicesList.map((voiceItem: VoiceListItem) => ({
                    value: voiceItem.id,
                    label: voiceItem.original_filename || "未命名语音",
                  }))}
                  style={{ width: "100%" }}
                />
              </>
            )}
            {selectedType === "localFile" && (
              <>
                <Text>上传语音素材</Text>
                <Dragger {...props} style={{ marginTop: 0 }}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                  </p>
                  <p className="ant-upload-text">拖放文件到此处，或点击上传</p>
                  <p className="ant-upload-hint">支持MP3, WAV, FLAC格式, 单个文件最大50MB</p>
                </Dragger>
              </>
            )}

            <Text>输入要克隆的文本:</Text>
            <TextArea
              rows={4}
              placeholder="请输入您希望克隆语音朗读的文本..."
              value={textToClone}
              onChange={(e) => setTextToClone(e.target.value)}
            />
            <Button type="primary" onClick={handleClone} loading={cloneLoading}>
              开始克隆
            </Button>
          </Space>
        </div>
      </Spin>

      <div style={{ border: "1px solid #f0f0f0", padding: 16 }}>
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
          {cloneAudioUrl && (
            <audio controls src={cloneAudioUrl} style={{ width: "100%" }} autoPlay />
          )}
        </Space>
      </div>
    </div>
  );
};

export default VoiceClone;
