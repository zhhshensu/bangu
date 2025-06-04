import { Button, Input, Form, Typography, Space, Divider, Flex } from "antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

const { Title, Text, Link } = Typography;

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    // Handle login logic here
    navigate({ to: "/welcome" });
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
          {t("sign in title")}
        </Title>
        <Text type="secondary" style={{ marginBottom: 24, display: "block" }}>
          {t("sign in description")}
        </Text>
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
          <Form.Item
            label={t("email")}
            name="email"
            rules={[{ required: true, message: "Please input your Email!", type: "email" }]}
          >
            <Input placeholder="name@example.com" />
          </Form.Item>

          <Form.Item
            label={
              <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                <Text>{t("password")}</Text>
                <Link style={{ fontSize: "0.85em", lineHeight: "1.5em" }} href="/forget-password">
                  {t("forget password")}
                </Link>
              </Flex>
            }
            labelCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("sign in")}
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>OR CONTINUE WITH</Divider>
        <Flex style={{ width: "100%" }} justify="space-around" gap={16}>
          <Button block icon={<GithubOutlined />}>
            {t("github")}
          </Button>
          <Button block icon={<GoogleOutlined />}>
            {t("google")}
          </Button>
        </Flex>
        <Text type="secondary" style={{ marginTop: 24, display: "block", fontSize: "0.85em" }}>
          By clicking login, you agree to our <Link>Terms of Service</Link> and{" "}
          <Link>Privacy Policy</Link>.
        </Text>
      </div>
    </div>
  );
};

export default SignIn;
