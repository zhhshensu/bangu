import { request } from "../lib/request";

export interface LoginOptions {
  grant_type: string; // 授权类型
  username: string; // 用户名
  password: string; // 密码
  captcha?: string; // 验证码
  rememberMe?: boolean; // 是否记住登录状态
  client_id?: string; // 客户端ID
  client_secret?: string; // 客户端密钥
  scope?: string; // 授权范围
  redirectUri?: string; // 重定向URI
  code?: string; // 授权码
  state?: string; // 状态参数
}

export class AuthService {
  // 登录
  static async login(options?: LoginOptions): Promise<any[]> {
    const data = await request.post(
      "/auth/login",
      {
        ...options,
        grant_type: options?.grant_type || "password", // 默认使用密码授权
        client_id: options?.client_id || "", // 客户端ID
        client_secret: options?.client_secret || "", // 客户端密钥
        scope: options?.scope || null, // 默认授权范围
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // 设置请求头为表单数据
        },
      }
    );
    return data as any;
  }
  static async logout(): Promise<any[]> {
    const data = await request.post("/auth/logout", {});
    return data as any;
  }
}
