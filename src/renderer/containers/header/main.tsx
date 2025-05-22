import { createRoot } from "react-dom/client";
import App from "./App";

// 初始化 React 应用
const initApp = async () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
};

// 启动应用
initApp();
window.addEventListener("DOMContentLoaded", () => {
  // 获取预加载脚本暴露的平台信息
  const platformInfo = window.mainApi.getPlatformInfo();
  // 设置文档根元素的自定义属性
  document.documentElement.dataset.platform = platformInfo.isMac ? "mac" : "win";
});
