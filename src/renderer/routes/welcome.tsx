import { createFileRoute, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import { Button, Menu, Layout, Avatar } from "antd";
import {
  AudioLines,
  CloudUpload,
  LayoutDashboard,
  LayoutGrid,
  PanelLeft,
  Settings,
  SquarePlay,
} from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { UserOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

export const Route = createFileRoute("/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("projects");
  const topItems = [
    {
      key: "dashboard",
      icon: <LayoutDashboard />,
      title: "概览",
      label: "概览",
    },
    {
      key: "voice-upload",
      icon: <CloudUpload />,
      title: "语音上传",
      label: "语音上传",
    },
    {
      key: "voice-clone",
      icon: <AudioLines />,
      title: "克隆工作室",
      label: "克隆工作室",
    },
    {
      key: "voice-library",
      icon: <SquarePlay />,
      title: "声音库",
      label: "声音库",
    },
  ];

  const bottomItems = [
    {
      key: "settings",
      icon: <Settings />,
      title: "设置",
      label: "设置",
    },
  ];

  useEffect(() => {
    if (location.pathname === "/welcome") {
      navigate({
        to: "/welcome/dashboard",
      });
    }
  }, [location]);

  useEffect(() => {
    const keys = [...topItems, ...bottomItems].map(({ key }) => key);
    const activeItemKey = keys.find((key) => location.pathname.includes(key));
    if (activeItemKey) {
      setActiveKey(activeItemKey);
    }
  }, [location]);

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Sider
        style={{
          background: "var(--background-left-navigation-web)",
        }}
        collapsed={collapsed}
        width={60}
        collapsedWidth={0}
        className="flex flex-col h-full justify-between"
      >
        <div className="logo py-4 px-4 flex justify-between items-center">
          <Avatar
            className="cursor-pointer"
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
            onClick={() => navigate({ to: "/welcome/profile" })}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar
            items={topItems}
            activeKey={activeKey}
            tooltipProps={{
              placement: "right",
            }}
            onItemClick={(key) => {
              setActiveKey(key);
              navigate({ to: `/welcome/${key}` });
            }}
          />
        </div>
        <div className="setting">
          <Sidebar
            items={bottomItems}
            activeKey={activeKey}
            tooltipProps={{
              placement: "right",
            }}
            onItemClick={(key) => {
              setActiveKey(key);
              navigate({ to: `/welcome/${key}` });
            }}
          />
        </div>
      </Sider>
      <Content
        style={{
          background: "var(--background-page-background-web)",
          height: "100%",
          overflow: "auto",
        }}
      >
        <div className="flex">
          {collapsed && (
            <div className="cursor-pointer">
              <PanelLeft onClick={() => setCollapsed(!collapsed)} />
            </div>
          )}
        </div>
        <Outlet />
      </Content>
    </Layout>
  );
}
export default RouteComponent;
