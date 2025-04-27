import { Typography } from "antd";

const { Title, Paragraph } = Typography;

interface P {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: P) => {
  return (
    <>
      <Title level={3}>{title}</Title>
      <Paragraph>{description}</Paragraph>
    </>
  );
};
