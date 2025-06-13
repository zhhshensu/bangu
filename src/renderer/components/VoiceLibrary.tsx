import { Row, Col, Button, Card, Input, Space, Typography, App } from "antd";
import React, { useMemo, useState } from "react";
import useVoice from "../hooks/useVoice";
import { VoiceListItem, VoiceService } from "../services/VoiceService";

const { Search } = Input;
const { Title, Text } = Typography;

interface VoiceItemProps extends VoiceListItem {
  onListen: (id: string | number) => void;
  onTTS: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const VoiceItem: React.FC<VoiceItemProps> = ({
  id,
  original_filename,
  description,
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
      // <Button type="link" onClick={() => onTTS(id)}>
      //   TTS
      // </Button>,
      <Button type="link" danger onClick={() => onDelete(id)}>
        删除
      </Button>,
    ]}
  >
    <Card.Meta
      title={<Text strong>{original_filename}</Text>}
      description={
        <Space direction="vertical">
          <Text type="secondary">{description}</Text>
        </Space>
      }
    />
  </Card>
);

const VoiceLibrary: React.FC = () => {
  const { message, modal, notification } = App.useApp();
  const { voices: voiceList, total: voicesTotal, setVoices: setVoiceList } = useVoice();
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleListen = (id: string | number) => {
    message.info(`试听语音: ${id}`);
    // Implement audio playback logic here
  };

  const handleTTS = (id: string | number) => {
    message.info(`TTS for voice: ${id}`);
    // Implement TTS functionality here
  };

  const handleDelete = async (id: string | number) => {
    if (!id) {
      message.error("语音ID不能为空");
      return;
    }
    modal.confirm({
      title: "确认删除",
      content: "确定要删除此语音吗？",
      onOk: async () => {
        try {
          await VoiceService.delete(id);
          setVoiceList((prevList) => prevList.filter((voice) => voice.id !== id));
          message.success("删除语音成功");
        } catch (error) {
          message.error(`删除语音失败: ${error}`);
        }
      },
      onCancel() {},
    });
  };

  const filteredVoices = useMemo(() => {
    return voiceList.filter((voice: VoiceListItem) => {
      return (
        !searchValue || voice?.original_filename?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  }, [voiceList, searchValue]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>声音库</Title>

      <Space style={{ width: "100%", marginBottom: 24 }}>
        <Search
          placeholder="搜索声音名称..."
          enterButton="搜索"
          onSearch={handleSearch}
          style={{ flex: 1 }}
        />
        {/* <Button type="primary">搜索</Button> */}
      </Space>

      <div>
        {filteredVoices.length > 0 ? (
          <Row gutter={16} style={{ marginBottom: "24px" }}>
            {filteredVoices.map((voice, index) => (
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
