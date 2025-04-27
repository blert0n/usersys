import { Form, Input, Modal, Button, Flex, ColorPicker } from "antd";
import { Role, RoleCreateInput } from "./types";

interface P {
  editingRole?: Role;
  isOpen: boolean;
  loading: boolean;
  toggle: () => void;
  onRoleUpsert: (values: RoleCreateInput) => void;
}

export const UpsertRole = ({
  editingRole,
  isOpen,
  loading = false,
  toggle,
  onRoleUpsert,
}: P) => {
  const [form] = Form.useForm();

  const onFinish = (values: RoleCreateInput) => {
    onRoleUpsert(values);
    toggle();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={toggle}
      onOk={toggle}
      title={editingRole?.id ? "Edit role" : "Create Role"}
      okText={editingRole?.id ? "Edit role" : "Create"}
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
          name: editingRole ? editingRole.name : "",
          color: editingRole ? editingRole.color : "",
        }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="color" label="Color" rules={[{ required: true }]}>
          <ColorPicker
            defaultValue={form.getFieldValue("color")}
            onChangeComplete={(color) =>
              form.setFieldValue("color", color.toHexString())
            }
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
