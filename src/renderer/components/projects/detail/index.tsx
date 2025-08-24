import React from "react";
import { Link, LinkOptions } from "@tanstack/react-router";
import { Tabs } from "antd";

interface ProjectDetailProps {
  projectId: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const linkOptions = <T extends string>({ to, ...rest }: LinkOptions<T>) => ({ to, ...rest });

  const items = [
    {
      key: "basicInfo",
      title: "基本信息",
      label: <Link to={`/projects/${projectId}/basicInfo`}>基本信息</Link>,
    },
    {
      key: "voice-upload",
      title: "语音上传",
      label: <Link to={`/voice-upload`}>语音上传</Link>,
    },
    {
      key: "merger",
      title: "合并处理",
      label: (
        <Link
          {...linkOptions({
            to: `/projects/${projectId}/merger/defaultIndex`,
          })}
        >
          合并处理
        </Link>
      ),
    },
    {
      key: "audit-track",
      title: "审计追踪",
      label: <Link to={`/projects/${projectId}/audit-track`}>审计追踪</Link>,
    },
    {
      key: "templates",
      title: "集团模板",
      label: <Link to={`/projects/${projectId}/templates`}>集团模板</Link>,
    },
    {
      key: "report-center",
      title: "报告中心",
      label: <Link to={`/projects/${projectId}/report-center`}>报告中心</Link>,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="basicInfo"
      items={items}
      tabBarStyle={{ backgroundColor: "#fff", paddingLeft: 24 }}
    />
  );
};

export default ProjectDetail;
