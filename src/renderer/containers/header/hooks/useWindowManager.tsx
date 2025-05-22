import { useState } from "react";

type WindowTab = {
  id: string;
  title: string;
  url: string;
};

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowTab[]>([{ id: "1", title: "主页", url: "/" }]);
  const [activeKey, setActiveKey] = useState("1");

  const handleNewWindow = () => {
    const newWindow = {
      id: Date.now().toString(),
      title: "新标签页",
      url: "/new-tab",
    };

    setWindows([...windows, newWindow]);
    setActiveKey(newWindow.id);
    window.mainApi.send("create-window", newWindow);
  };

  const handleCloseWindow = (windowId: string) => {
    if (windows.length === 1) return;

    const newWindows = windows.filter((w) => w.id !== windowId);
    setWindows(newWindows);
    setActiveKey(newWindows[newWindows.length - 1].id);
    window.mainApi.send("close-window", windowId);
  };

  const handleContextMenu = (windowId: string, action: string) => {
    switch (action) {
      case "close":
        handleCloseWindow(windowId);
        break;
      case "reload":
        window.mainApi.send("reload-window", windowId);
        break;
    }
  };

  return {
    windows,
    activeKey,
    handleTabChange: setActiveKey,
    handleNewWindow,
    handleCloseWindow,
    handleContextMenu,
  };
};
