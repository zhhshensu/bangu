import { Upload, Button, message, Space, Typography, Input, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import React, { useState } from "react";
import { VoiceService } from "../services/VoiceService";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const VoiceUpload: React.FC = () => {
  const { message, modal, notification } = App.useApp();
  const [fileList, setFileList] = useState<any[]>([]);
  const [description, setDescription] = useState<string>("");

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

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("请选择文件进行上传");
      return;
    }
    const file = fileList[0];
    const data = await VoiceService.upload({ file, description });

    // Here you would typically send the file to your server
    message.success("文件上传成功");
    console.log("Uploading file:", fileList[0]);
    setFileList([]); // Clear file list after "upload"
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>语音上传</Title>

      <div style={{ marginBottom: 24, border: "1px dashed #d9d9d9", padding: 24 }}>
        <Text strong>上传新的语音素材</Text>
        <Dragger {...props} style={{ marginTop: 16 }}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          </p>
          <p className="ant-upload-text">拖放文件到此处，或点击上传</p>
          <p className="ant-upload-hint">支持MP3, WAV, FLAC格式, 单个文件最大50MB</p>
        </Dragger>
        <div style={{ marginTop: 16 }}>
          <Text strong>语音素材描述</Text>
          <Input.TextArea
            placeholder="请输入语音描述"
            rows={4}
            style={{ marginTop: 8 }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={handleUpload}
          style={{ marginTop: 16 }}
        >
          开始上传
        </Button>
      </div>

      {/* <div style={{ border: "1px solid #f0f0f0", padding: 24 }}>
        <Text strong>已上传语音列表</Text>
        <p style={{ marginTop: 16 }}>暂无已上传文件.</p>
      </div> */}
    </div>
  );
};

export default VoiceUpload;
