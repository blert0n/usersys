import styles from "@/styles/General/Table.module.css";
import {
  Table,
  TableColumnsType,
  Dropdown,
  Pagination,
  Menu,
  Typography,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Role } from "./types";
import { TAKE } from "./const";

const { Text } = Typography;

interface P {
  roles: Role[];
  total: number;
  page: number;
  onRoleEdit: (user: Role) => void;
  onRoleDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

export const RolesTable = ({
  roles,
  total,
  page,
  onRoleEdit,
  onRoleDelete,
  onPageChange,
}: P) => {
  const columns: TableColumnsType<Role> = [
    {
      title: "",
      dataIndex: "color",
      render: (color: string) => (
        <div className={styles.circle} style={{ background: color }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => <Text strong>{record.name}</Text>,
    },
    {
      title: "Users assigned",
      dataIndex: "_count",
      render: (data) => <>{data.users}</>,
    },
    {
      title: "",
      dataIndex: "id",
      render: (_, record) => (
        <Dropdown
          dropdownRender={() => (
            <Menu>
              <Menu.Item key={"edit"} onClick={() => onRoleEdit(record)}>
                Edit
              </Menu.Item>
              <Menu.Item key="Delete" onClick={() => onRoleDelete(record.id)}>
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
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        className={styles.pagination}
        current={page}
        onChange={onPageChange}
        total={total}
        defaultPageSize={TAKE}
        showSizeChanger={false}
        align="end"
      />
    </div>
  );
};
