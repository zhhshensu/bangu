import { Button, Input, Switch, Typography, Space, Divider, Radio, List } from "antd";
import React, { useState } from "react";
import { SaveOutlined, LockOutlined, RightOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthService } from "@/renderer/services/authService";

const { Title, Text } = Typography;

const SettingsPage: React.FC = () => {
  const [marketingEmail, setMarketingEmail] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logout();
    localStorage.removeItem("access_token");
    navigate({
      to: "/sign-in",
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>设置</Title>

      {/* 账户设置 */}
      <div style={{ marginBottom: 24, padding: 24, border: "1px solid #f0f0f0" }}>
        <Title level={4}>账户设置</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>用户名</Text>
          <Input value="user_ai_clone" disabled />
          <Text>邮箱</Text>
          <Input value="user@example.com" disabled />
          <Text>密码</Text>
          <Input.Password value="********" disabled />
          <Button type="link" style={{ paddingLeft: 0 }}>
            点击修改密码
          </Button>
          <Button type="primary" icon={<SaveOutlined />}>
            保存更改
          </Button>
        </Space>
      </div>

      {/* 通知设置 */}
      <div style={{ marginBottom: 24, padding: 24, border: "1px solid #f0f0f0" }}>
        <Title level={4}>通知设置</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space>
            <Switch defaultChecked />
            <Text>接收邮件通知</Text>
          </Space>
          <Space>
            <Switch defaultChecked />
            <Text>接收应用内通知</Text>
          </Space>
          {/* <Space>
            <Radio.Group onChange={(e) => setMarketingEmail(e.target.value)} value={marketingEmail}>
              <Radio value={true}></Radio>
            </Radio.Group>
            <Text>接收营销邮件</Text>
          </Space> */}
        </Space>
      </div>

      {/* 隐私与安全 */}
      <div style={{ marginBottom: 24, padding: 24, border: "1px solid #f0f0f0" }}>
        <Title level={4}>隐私与安全</Title>
        <List
          itemLayout="horizontal"
          dataSource={[
            { title: "两步验证", description: "", status: "已启用", icon: <LockOutlined /> },
            { title: "数据使用政策", description: "", status: "已启用", icon: null },
          ]}
          renderItem={(item) => (
            <List.Item actions={[<RightOutlined />]}>
              <List.Item.Meta
                avatar={item.icon}
                title={<Text>{item.title}</Text>}
                description={item.description}
              />
              {<Text type="success">{item.status}</Text>}
            </List.Item>
          )}
        />
      </div>

      {/* 退出登录 */}
      <div style={{ textAlign: "center" }}>
        <Button type="primary" danger onClick={handleLogout}>
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
