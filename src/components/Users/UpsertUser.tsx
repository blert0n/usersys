import { Form, Input, Select, Modal, Button, Flex } from "antd";
import type { CreateUserValues, Role, User } from "./types";

interface P {
  roles: Role[];
  editingUser?: User;
  isOpen: boolean;
  loading: boolean;
  toggle: () => void;
  onUserUpsert: (values: CreateUserValues) => void;
}

export const UpsertUser = ({
  roles,
  editingUser,
  isOpen,
  loading = false,
  toggle,
  onUserUpsert,
}: P) => {
  const [form] = Form.useForm();

  const onFinish = (values: CreateUserValues) => {
    onUserUpsert(values);
    toggle();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={toggle}
      onOk={toggle}
      title={editingUser?.id ? "Edit user" : "Create User"}
      okText={editingUser?.id ? "Edit user" : "Create"}
      footer={null}
      afterOpenChange={() => form.resetFields()}
      destroyOnClose
    >
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        layout="vertical"
        initialValues={{
          name: editingUser ? editingUser.name : "",
          email: editingUser ? editingUser.email : "",
          roles: editingUser
            ? editingUser.roles.map((role) => role.role.id)
            : [],
        }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="roles" label="Role" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            options={roles?.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />
        </Form.Item>
        <Flex justify="end" gap="small">
          <Button onClick={toggle}>Close</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            disabled={loading}
            loading={loading}
          >
            Submit
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};
