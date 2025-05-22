import { supabase } from "../lib/initDatabase";

export interface Project {
  project_code: string;
  project_name: string;
  trade: string;
  type: string;
  department_id: string;
  department_name: string;
  customer_id: string;
  customer_name: string;
  project_category: string;
  project_year: string;
  start_quarter: string;
  start_amount: string;
  project_state: number;
  edit_user: string;
  edit_date: Date;
  third_id: string;
  db_name: string;
  edit_user_name: string;
  short_name: string;
  receive_person: string;
  report_type: string;
  audit_report_template: string;
  audit_report_date: string;
  created_at: Date;
  updated_at: Date;
}

export class ProjectService {
  // 获取所有项目
  static async getAllProjects(options?: any): Promise<Project[]> {
    const { data = [] } = await supabase.from("projects").select();
    return data as any;
  }

  // 根据编号获取项目
  static async getProjectInfo(projectCode: string): Promise<Project | null> {
    const result: any = await supabase.from("projects").select().eq("project_code", projectCode);
    return Array.isArray(result?.data) && result?.data.length > 0 ? result.data[0] : {};
  }

  // 创建新项目
  static async createProject(project: Omit<Project, "created_at" | "updated_at">): Promise<any> {
    const result: any = await supabase.from("projects").insert(project);
  }

  // 更新项目
  static async updateProject(
    projectCode: string,
    updates: Partial<Omit<Project, "project_code" | "created_at" | "updated_at">>
  ): Promise<any> {
    const result: any = await supabase
      .from("projects")
      .update(updates)
      .eq("project_code", projectCode);
    return result;
  }

  // 删除项目
  static async deleteProject(projectCode: string): Promise<void> {
    await supabase.from("projects").delete().eq("project_code", projectCode);
  }
}
