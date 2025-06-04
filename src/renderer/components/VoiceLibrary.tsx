import { Row, Col, Button, Card, Input, Space, Typography, message } from "antd";
import React, { useState } from "react";

const { Search } = Input;
const { Title, Text } = Typography;

interface VoiceItemProps {
  id: string;
  name: string;
  description: string;
  timeAgo: string;
  onListen: (id: string) => void;
  onTTS: (id: string) => void;
  onDelete: (id: string) => void;
}

const VoiceItem: React.FC<VoiceItemProps> = ({
  id,
  name,
  description,
  timeAgo,
  onListen,
  onTTS,
  onDelete,
}) => (
  <Card
    key={id}
    style={{ marginBottom: 16 }}
    actions={[
      <Button type="link" onClick={() => onListen(id)}>
        试听
      </Button>,
      <Button type="link" onClick={() => onTTS(id)}>
        TTS
      </Button>,
      <Button type="link" danger onClick={() => onDelete(id)}>
        删除
      </Button>,
    ]}
  >
    <Card.Meta
      title={<Text strong>{name}</Text>}
      description={
        <Space direction="vertical">
          <Text type="secondary">{description}</Text>
          <Text type="secondary">{timeAgo}</Text>
        </Space>
      }
    />
  </Card>
);

const VoiceLibrary: React.FC = () => {
  const [voiceList, setVoiceList] = useState([
    {
      id: "1",
      name: "我的专属声音 V2",
      description: "基于最新录音, 效果极佳.",
      timeAgo: "2小时前",
    },
    {
      id: "2",
      name: "项目演示声音",
      description: "用于产品演示的通用女声.",
      timeAgo: "3天前",
    },
    {
      id: "3",
      name: "英文播客声音",
      description: "克隆自一段英文播客素材.",
      timeAgo: "1周前",
    },
  ]);

  const handleSearch = (value: string) => {
    message.info(`搜索: ${value}`);
    // In a real app, you'd filter the list based on the search value
  };

  const handleListen = (id: string) => {
    message.info(`试听语音: ${id}`);
    // Implement audio playback logic here
  };

  const handleTTS = (id: string) => {
    message.info(`TTS for voice: ${id}`);
    // Implement TTS functionality here
  };

  const handleDelete = (id: string) => {
    message.success(`删除语音: ${id}`);
    setVoiceList((prevList) => prevList.filter((voice) => voice.id !== id));
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>声音库</Title>

      <Space style={{ width: "100%", marginBottom: 24 }}>
        <Search placeholder="搜索声音名称..." onSearch={handleSearch} style={{ flex: 1 }} />
        <Button type="primary">搜索</Button>
      </Space>

      <div>
        {voiceList.length > 0 ? (
          <Row gutter={16} style={{ marginBottom: "24px" }}>
            {voiceList.map((voice, index) => (
              <Col span={8} key={index}>
                <VoiceItem
                  key={voice.id}
                  {...voice}
                  onListen={handleListen}
                  onTTS={handleTTS}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p>暂无声库文件.</p>
        )}
      </div>
    </div>
  );
};

export default VoiceLibrary;
