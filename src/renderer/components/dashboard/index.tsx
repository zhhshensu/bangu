import React from "react";
import { Row, Col, Card, Button, Statistic, List, Input, Typography } from "antd";
import {
  CloudUploadOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
const { Title, Text } = Typography;

const Dashboard = () => {
  // 统计数据
  const stats = [
    { title: "总克隆任务", value: 125, description: "已完成任务数" },
    { title: "克隆成功率", value: "75%", description: "过去30天" },
    { title: "平均克隆时长", value: "35s", description: "每次任务" },
  ];

  // 活动记录
  const activities = [
    { id: 1, action: "完成了“项目A”的语音克隆", icon: <CheckCircleOutlined /> },
    { id: 2, action: "上传了新的语音素材“张三_录音.wav”", icon: <UploadOutlined /> },
    { id: 3, action: "创建了新项目“产品演示语音”", icon: <ProjectOutlined /> },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={4}>概览</Title>

      {/* 顶部统计卡片 */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        {stats.map((stat, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ color: "#3f8600", fontSize: "32px" }}
              />
              <div style={{ color: "rgba(0, 0, 0, 0.45)", fontSize: "14px" }}>
                {stat.description}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快速操作区域 */}
      <Card title="快速操作" style={{ marginBottom: "24px" }}>
        <Row gutter={16} align="middle">
          <Col>
            <Button type="primary" block icon={<CloudUploadOutlined />}>
              <Link to="/welcome/voice-upload">上传语音素材</Link>
            </Button>
          </Col>
          <Col>
            <Button type="primary" block icon={<CloudUploadOutlined />}>
              <Link to="/welcome/voice-clone">新建克隆任务</Link>
            </Button>
          </Col>

          <Col>
            <Button type="primary" block icon={<CloudUploadOutlined />}>
              <Link to="/welcome/voice-library">查看声音库</Link>
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 最新活动区域 */}
      <Card title="最新活动" style={{ border: "1px solid #b7eb8f" }}>
        <List
          itemLayout="horizontal"
          dataSource={activities}
          renderItem={(item) => (
            <List.Item style={{ padding: "12px 0" }}>
              <List.Item.Meta
                avatar={item.icon}
                title={item.action}
                description={<span style={{ color: "#8c8c8c" }}>2小时前</span>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
