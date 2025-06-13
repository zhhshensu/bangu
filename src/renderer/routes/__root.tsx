import { Outlet, createRootRoute, redirect } from "@tanstack/react-router";
import NotFound from "../components/common/not-found";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { getToken } from "../lib/auth";
dayjs.locale("zh-cn");

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    // Define public routes that do not require authentication
    const publicRoutes = ["/sign-in", "/sign-up", "/forget-password"];
    const token = getToken();

    // If the current path is a public route, allow access
    if (publicRoutes.includes(location.pathname)) {
      if (token) {
        throw redirect({ to: "/welcome" });
      }
      return;
    }

    // Check for authentication token
    if (!token) {
      // If not authenticated, redirect to sign-in page
      throw redirect({ to: "/sign-in" });
    }
  },
  component: () => (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#CC0033",
          borderRadius: 4,
        },
        cssVar: true,
        hashed: false,
      }}
    >
      <App>
        <Outlet />
      </App>
    </ConfigProvider>
  ),
  notFoundComponent: () => <NotFound />,
});
