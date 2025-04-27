import styles from "@/styles/General/DataControls.module.css";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Space, Typography, Button } from "antd";
import pluralize from "pluralize";

const { Title, Text } = Typography;

interface P {
  name: string;
  total: number;
  search: string;
  onSearch: (search: string) => void;
  onCreate: () => void;
}

export const DataControls = ({
  name,
  total,
  search,
  onSearch,
  onCreate,
}: P) => {
  return (
    <div className={styles.container}>
      <Space className={`${styles.baseline} ${styles.count}`}>
        <Title level={5}>
          All {pluralize.plural(name)} <Text>{total}</Text>
        </Title>
      </Space>
      <Space className={`${styles.baseline} ${styles.wrap}`}>
        <Input
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Button
          icon={<PlusOutlined />}
          className="fullWidth"
          type="primary"
          onClick={onCreate}
        >
          Add {pluralize.singular(name)}
        </Button>
      </Space>
    </div>
  );
};
