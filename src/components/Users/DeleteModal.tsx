import { Button, Modal } from "antd";

interface P {
  isOpen: boolean;
  selectedCount: number;
  toggle: () => void;
  onDelete: () => void;
}

export const DeleteModal = ({
  isOpen,
  selectedCount = 0,
  toggle,
  onDelete,
}: P) => {
  return (
    <>
      <Button danger onClick={toggle} disabled={!selectedCount}>
        Delete
      </Button>
      <Modal open={isOpen} onCancel={toggle} onOk={onDelete} title="Delete">
        Are you sure you want to delete {selectedCount} users?
      </Modal>
    </>
  );
};
