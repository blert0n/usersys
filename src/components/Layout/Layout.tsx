"use client";
import { useThemeStore } from "@/store/app";
import Sidebar from "./Sidebar";
import { ConfigProvider, theme } from "antd";

interface P {
  children: React.ReactNode;
}
const { darkAlgorithm, defaultAlgorithm } = theme;

export default function Layout({ children }: P) {
  const { isDarkMode } = useThemeStore();
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#5e5e5e",
        },
        components: {
          Menu: {
            colorBgBase: "#FAFAFA",
            itemBg: "#FAFAFA",
            itemSelectedBg: "#F1F1F1",
            itemColor: "#5e5e5e",
            itemSelectedColor: "#151515",
            darkSubMenuItemBg: "red",
            iconSize: 28,
          },
          Layout: {
            bodyBg: "#FAFAFA",
            triggerBg: "#FAFAFA",
            triggerColor: "#5e5e5e",
            siderBg: "#FAFAFA",
          },
          Typography: {
            colorPrimaryText: "red",
          },
          Table: {
            headerBg: "#FAFAFA",
            headerColor: "#6a6a6a",
            headerSplitColor: "#FAFAFA",
            rowSelectedBg: "#F1F1F1",
            rowSelectedHoverBg: "#F1F1F1",
          },
          Form: {
            itemMarginBottom: 8,
          },
          Select: {
            optionSelectedBg: "#FAFAFA",
          },
        },
      }}
    >
      <Sidebar>{children}</Sidebar>
    </ConfigProvider>
  );
}
