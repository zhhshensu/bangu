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
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${getToken()}`; // 请求头携带 token
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // If the response data is a Blob, return the entire response object
    // so that headers (like content-disposition) can be accessed.
    if (response.data instanceof Blob) {
      return response;
    }
    if (response.data.code && response.data.code !== 20000) {
      message.error({
        content: response.data.message || "请求失败",
        duration: 3,
      });
      return Promise.reject(response.data);
    }
    return response.data.data;
  },
  (error) => {
    if (
      error.response &&
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login")
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
      } else if (error.response) {
        // For other server errors (non-401, non-blob)
        notification.error({
          message: error.response.data?.message || "服务器异常",
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

/**
 * 下载文件，处理 Blob 响应和 content-disposition 头部
 * @param response axios 响应对象
 */
export function downloadFile(response: any) {
  const contentType = response.headers["content-type"] || "";
  if (response.data instanceof Blob) {
    const contentDisposition = response.headers["content-disposition"];
    let filename = "download"; // 默认文件名

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename\*?=[^;]+?''([^;]+)/);
      if (filenameMatch && filenameMatch[1]) {
        try {
          filename = decodeURIComponent(filenameMatch[1]);
        } catch (e) {
          console.error("Error decoding filename from content-disposition", e);
          // Fallback to simpler regex if decoding fails
          const simpleFilenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (simpleFilenameMatch && simpleFilenameMatch[1]) {
            filename = simpleFilenameMatch[1];
          }
        }
      } else {
        const simpleFilenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (simpleFilenameMatch && simpleFilenameMatch[1]) {
          filename = simpleFilenameMatch[1];
        }
      }
    }

    // Create a Blob URL
    const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up the URL
    return true;
  }
  return false;
}
