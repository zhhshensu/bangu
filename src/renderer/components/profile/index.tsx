import { Button, Form, Input, Radio } from "antd";

const Profile = () => {
  const [form] = Form.useForm();
  

  const onValuesChange = (values: any) => {};

  return (
    <div>
      <h3 className="text-2xl mb-2">Profile</h3>
      <Form
        style={{ maxWidth: 600 }}
        form={form}
        layout="vertical"
        variant={"filled"}
        initialValues={{ layout: "vertical" }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="Username" name="username">
          <Input placeholder="input username" />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Update profile</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
