import { nanoid } from "nanoid";
import { supabase } from "../lib/initDatabase";

export interface OrgInfo {
  [kye: string]: any;
}

export class OrgService {
  // 获取所有节点
  static async getAllOrgs(project_code: string): Promise<OrgInfo[]> {
    const { data = [] } = await supabase.from("orgs").select().eq("project_code", project_code);
    return data as any;
  }
  // 根据编号节点信息
  static async getOrgInfo(zcbfid: string): Promise<OrgInfo | null> {
    const result: any = await supabase.from("orgs").select().eq("zcbfid", zcbfid);
    return Array.isArray(result?.data) && result?.data.length > 0 ? result.data[0] : {};
  }

  // 创建新节点
  static async createOrg(org: Omit<OrgInfo, "created_at" | "updated_at">): Promise<any> {
    const result: any = await supabase.from("orgs").insert(org);
    return result;
  }

  // 更新项目
  static async updateOrg(
    zcbfid: string,
    updates: Partial<Omit<OrgInfo, "zcbfid" | "created_at" | "updated_at">>
  ): Promise<any> {
    const result: any = await supabase.from("orgs").update(updates).eq("zcbfid", zcbfid);
    return result;
  }

  // 删除项目
  static async deleteOrg(zcbfid: string): Promise<void> {
    await supabase.from("orgs").delete().eq("zcbfid", zcbfid);
  }
}
