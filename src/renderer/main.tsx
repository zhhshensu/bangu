import "@ant-design/v5-patch-for-react-19";
import "./i18n/config";
import { RouterProvider, createRouter, createHashHistory, redirect } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { StrictMode } from "react";

import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  history: hashHistory, // 全局路由拦截
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      // 访问根路径时跳转到 `/about`
      throw redirect({ to: "/welcome" });
    }
  },
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 初始化 React 应用
const initApp = async () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <PrimeReactProvider
          value={{
            unstyled: false, // 无样式渲染
          }}
        >
          <RouterProvider router={router} />
        </PrimeReactProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
};

// 启动应用
initApp();
