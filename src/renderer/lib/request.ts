import { message, notification } from "antd";
import axios from "axios";
import { getToken, removeToken, setToken } from "./auth";

let isRefreshing = false;
let requests: any[] = [];

// 刷新 cpasToken 的接口
const refreshToken = () => {
  // 这里假设有一个刷新 token 的接口
  return new Promise((resolve, reject) => {
    resolve("");
  });
};

// 创建 axios 实例
const instance = axios.create({
  // timeout: 10000,
  baseURL: import.meta.env.VITE_API_BASE_URL, // 基础 URL
  withCredentials: true, // 跨域请求是否需要携带 cookie
});
instance.interceptors.request.use(
  (config) => {
    config.headers["access_token"] = getToken(); // 请求头携带 token
    config.headers["content-type"] = "application/json"; // 默认类型
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (
      error.response &&
      error.response?.status === 401 &&
      !error.config.url.includes("/user/login")
    ) {
      const { config } = error;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res: any) => {
            if (res.ok) {
              const { access_token } = res.data;
              setToken(access_token);
              config.headers.access_token = `${access_token}`;
              // token 刷新后将数组的方法重新执行
              requests.forEach((cb) => cb(access_token));
              requests = []; // 重新请求完清空
              return instance(config);
            } else {
              console.log("抱歉，您的登录状态已失效，请重新登录！");
              removeToken();
              localStorage.removeItem("loginInfo");
              return Promise.reject(res);
            }
          })
          .catch((err) => {
            console.log("抱歉，您的登录状态已失效，请重新登录！");
            removeToken();
            localStorage.removeItem("loginInfo");
            return Promise.reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        // 返回未执行 resolve 的 Promise
        return new Promise((resolve) => {
          // 用函数形式将 resolve 存入，等待刷新后再执行
          requests.push((token: string) => {
            config.headers.cpasToken = `${token}`;
            resolve(instance(config));
          });
        });
      }
    } else {
      if (!window.navigator.onLine) {
        notification.error({
          message: "网络异常，请检查网络是否正常连接",
        });
      } else if (error.code === "ECONNABORTED") {
        notification.error({
          message: "请求超时",
        });
      } else {
        notification.error({
          message: "服务器异常",
        });
      }
    }
    return Promise.reject(error);
  }
);

export const request = instance;
