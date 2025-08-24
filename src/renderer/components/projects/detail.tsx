import { ProjectProvider } from "@/renderer/contexts/ProjectContext";
import useProjectInfo from "@/renderer/hooks/useProjectInfo";

import { Suspense, useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  linkOptions,
} from "@tanstack/react-router";
import Sidebar from "./components/Siderbar";
import { House, Info, Merge, History, Layers, FileText, Copy } from "lucide-react";
import { Tooltip } from "antd";

const ProjectDetail = () => {
  const params = useParams({ strict: false });
  const location = useLocation();
  const navigate = useNavigate(); // 路由跳转
  const [collapsed, setCollapsed] = useState(true);
  const [activeKey, setActiveKey] = useState<string>("merger");

  const projectId = params.projectId || "";
  const projectInfo = useProjectInfo({ projectCode: projectId });

  const sideMenuItems = [
    // {
    //   key: "basicInfo",
    //   title: "基本信息",
    //   icon: <Info className="w-5 h-5" />,
    // },
    {
      key: "merger",
      title: "合并处理",
      label: "合并处理",
      icon: <Merge className="w-5 h-5" />,
    },
    {
      key: "audit-track",
      title: "审计追踪",
      label: "审计追踪",
      icon: <History className="w-5 h-5" />,
    },
    {
      key: "templates",
      title: "集团模板",
      label: "集团模板",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      key: "report-center",
      title: "报告中心",
      label: "报告中心",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const settingItems = [
    {
      key: "basicInfo",
      label: <Link to={`/projects/${projectId}/basicInfo`}>编辑项目基本信息</Link>,
    },
  ];

  const settingMenuProps = {
    items: settingItems,
  };

  const backWelcome = () => {
    navigate({
      to: "/welcome/projects",
    });
  };

  return (
    <ProjectProvider projectInfo={projectInfo}>
      <div className="w-full h-screen flex flex-col">
        <div className="border-b-[1px] border-gray-200">
          <div className="flex items-center p-4">
            <Tooltip placement="bottom" title="返回">
              <div onClick={() => backWelcome()} className="cursor-pointer">
                <House />
              </div>
            </Tooltip>
            <div className="flex items-center">
              <div className="text-base px-2">{projectInfo.short_name}</div>
              <div className="flex items-center px-2 gap-1">
                <span>{projectInfo.project_code}</span>
                <div className="cursor-pointer">
                  <Copy size={18} className="w-[18px] h-[18px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-between">
          <Sidebar
            items={sideMenuItems}
            activeKey={activeKey}
            showLabel={true}
            onItemClick={(key) => {
              setActiveKey(key);
              if (key === "merger") {
                navigate({
                  to: "/projects/$projectId/merger/$orgId",
                  params: { projectId, orgId: "defaultIndex" },
                });
              } else {
                navigate({ to: `/projects/${projectId}/${key}` });
              }
            }}
          />
          <div className="p-4 h-full bg-white flex-1">
            <Suspense>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </ProjectProvider>
  );
};

export default ProjectDetail;
