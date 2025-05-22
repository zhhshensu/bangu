import { Outlet, createRootRoute, redirect } from "@tanstack/react-router";
import NotFound from "../components/common/not-found";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
dayjs.locale("zh-cn");

export const Route = createRootRoute({
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
      <Outlet />
    </ConfigProvider>
  ),
  notFoundComponent: () => <NotFound />,
});
