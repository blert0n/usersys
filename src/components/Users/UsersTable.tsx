import styles from "@/styles/General/Table.module.css";
import {
  Flex,
  Table,
  TableColumnsType,
  TableProps,
  Typography,
  Dropdown,
  Pagination,
  Tag,
  Space,
  Menu,
} from "antd";
import { useState } from "react";
import { DeleteModal } from "./DeleteModal";
import { MoreOutlined } from "@ant-design/icons";
import { formatDate } from "@/utils/dates";
import type { User } from "./types";
import { TAKE } from "./const";

const { Text } = Typography;

interface P {
  users: User[];
  total: number;
  page: number;
  selectedUsers: number[];
  onUserEdit: (user: User) => void;
  onUserDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  onSelectedChange: (selected: number[]) => void;
  onSelectedDelete: () => void;
}

export const UsersTable = ({
  users,
  total,
  page,
  selectedUsers,
  onUserEdit,
  onUserDelete,
  onSelectedChange,
  onSelectedDelete,
  onPageChange,
}: P) => {
  const [isDeleteModalOpen, setDeleteModal] = useState(false);

  const rowSelection: TableProps<User>["rowSelection"] = {
    onChange: (selectedRowKeys: number[]) => {
      const currentPageKeys = users.map((user) => user.id);
      const otherPagesKeys = selectedUsers.filter(
        (key) => !currentPageKeys.includes(key)
      );

      if (selectedRowKeys.length === 0) {
        // deselecting all from page
        onSelectedChange(otherPagesKeys);
      }
      onSelectedChange([...selectedRowKeys, ...otherPagesKeys]);
    },
  };

  const columns: TableColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <Flex gap="small" vertical>
          <Text strong>{record.name}</Text>
          <Text>{record.email}</Text>
        </Flex>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      render: (_, record) => (
        <Space size="small">
          {record.roles.length === 0 && <Tag>None</Tag>}
          {record.roles.map((userRole) => (
            <Tag
              key={`${record.id}-${userRole.role.id}`}
              color={userRole.role.color}
            >
              {userRole.role.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Last updated",
      dataIndex: "updatedAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "",
      dataIndex: "id",
      render: (_, record) => (
        <Dropdown
          dropdownRender={() => (
            <Menu>
              <Menu.Item key={"edit"} onClick={() => onUserEdit(record)}>
                Edit
              </Menu.Item>
              <Menu.Item key="Delete" onClick={() => onUserDelete(record.id)}>
                Delete
              </Menu.Item>
            </Menu>
          )}
          key={record.id}
        >
          <MoreOutlined className={styles.icon} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          <DeleteModal
            isOpen={isDeleteModalOpen}
            selectedCount={selectedUsers.length}
            toggle={() => setDeleteModal((prev) => !prev)}
            onDelete={() => {
              onSelectedDelete();
              onSelectedChange([]);
              setDeleteModal(false);
            }}
          />
          {selectedUsers.length
            ? `Selected ${selectedUsers.length} users`
            : null}
        </Flex>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
            selectedRowKeys: selectedUsers,
          }}
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={false}
        />
        <Pagination
          current={page}
          onChange={onPageChange}
          total={total}
          defaultPageSize={TAKE}
          showSizeChanger={false}
          align="end"
        />
      </Flex>
    </div>
  );
};
