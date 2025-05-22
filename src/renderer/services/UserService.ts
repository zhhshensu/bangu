import { supabase } from "../lib/initDatabase";

export interface UserInfo {}

export class UserService {
  // 获取所有项目
  static async getAllUsers(options?: any): Promise<UserInfo[]> {
    const { data = [] } = await supabase.from("users").select();
    return data as any;
  }
}
