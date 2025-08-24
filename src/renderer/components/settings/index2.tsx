import { useState } from "react";
import SettingsPage from "./SettingsPage";

const Settings = () => {
  const [active, setActive] = useState("general");

  const items = [
    {
      key: "general",
      label: "常规配置",
    },
    {
      key: "data",
      label: "数据设置",
    },
    {
      key: "aboutUs",
      label: "关于我们",
    },
  ];

  const onMenuClick = () => {};

  return (
    <div className="flex h-full">
      <Menu onClick={onMenuClick} style={{ width: 180 }} mode="inline" items={items} />
      <div>{active === "general" && GeneralSetting()}</div>
    </div>
  );
};

export default Settings;
