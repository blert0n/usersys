import { SketchOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import styles from "@/styles/Layout/Layout.module.css";
import Link from "next/link";

const { Sider, Content } = Layout;

const MENU_ITEMS = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: <Link href="/">Users</Link>,
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: <Link href="/roles">Roles</Link>,
  },
];

interface P {
  children: React.ReactNode;
}

const Sidebar = ({ children }: P) => {
  return (
    <Layout style={{ height: "100%" }}>
      <Sider collapsible>
        <div className={styles.header}>
          <SketchOutlined />
        </div>
        <Menu theme="light" items={MENU_ITEMS} />
      </Sider>
      <Layout className={styles.layout}>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
