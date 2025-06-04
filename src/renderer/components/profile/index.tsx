import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Space, Typography } from "antd";
const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();

  const onValuesChange = (values: any) => {};

  return (
    <div style={{ padding: 24 }}>
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
  );
};

export default Profile;
