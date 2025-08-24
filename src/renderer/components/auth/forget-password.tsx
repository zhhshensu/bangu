import { Button, Input, Form, Typography, Space } from "antd";
import React from "react";

const { Title, Text, Link } = Typography;

const ForgetPassword: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    // Handle forgot password logic here
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          width: 400,
          textAlign: "center",
        }}
      >
        {/* <img src="/path/to/your/logo.svg" alt="Shadcn Admin" style={{ height: 40, marginBottom: 24 }} /> */}{" "}
        {/* Placeholder for logo */}
        <Title level={4} style={{ marginBottom: 8 }}>
          Forgot Password
        </Title>
        <Text type="secondary" style={{ marginBottom: 24, display: "block" }}>
          Enter your registered email and we will send you a link to reset your password.
        </Text>
        <Form
          name="forgot-password"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email", type: "email" }]}
          >
            <Input placeholder="name@example.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Continue
            </Button>
          </Form.Item>
        </Form>
        <Text type="secondary" style={{ marginTop: 24, display: "block", fontSize: "0.85em" }}>
          Don't have an account? <Link href="/register">Sign up</Link>.
        </Text>
        <Text type="secondary" style={{ display: "block", fontSize: "0.85em" }}>
          还没有账户? <Link>立即注册</Link>.
        </Text>
      </div>
    </div>
  );
};

export default ForgetPassword;
