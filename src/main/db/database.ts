import { PGlite, MemoryFS } from "@electric-sql/pglite";
import { app } from "electron";
import fs from "fs";
import { runMigrations } from "./migrations";
import { migration as initialMigration } from "./migrations/001_initial_schema";
import Constants from "../utils/Constants";
import path, { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export class DatabaseService {
  private db: PGlite | null = null;
  private static instance: DatabaseService;
  private initialized = false;
  // private static DB_PATH = path.join(app.getPath("userData"), "banguData");
  private DB_DIR: string; // 数据库目录

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 动态判断环境
      const appPath = app.getAppPath();
      this.DB_DIR = resolve(appPath, "banguData");
      this.DB_DIR = app.isPackaged
        ? path.join(app.getPath("userData"), "data_app")
        : resolve(appPath, "banguData");

      if (!fs.existsSync(this.DB_DIR)) {
        fs.mkdirSync(this.DB_DIR, { recursive: true });
      }
      console.log("Database2 path:", this.DB_DIR);
      // 使用内存存储
      this.db = new PGlite({
        fs: new MemoryFS(),
      });
      console.log("Waiting for ready...");
      await this.db.waitReady;
      this.initialized = true;
      console.log("Database initialized successfully with file system storage at:", this.DB_DIR);
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }

    // 运行所有迁移
    await runMigrations(this.db, [
      initialMigration,
      // 在这里添加更多迁移...
    ]);
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error("Database not initialized");
    const result = await this.db.query(sql, params);
    return result.rows as T[];
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    await this.db.query(sql, params);
  }

  async transaction<T>(callback: (db: PGlite) => Promise<T>): Promise<T> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      await this.db.query("BEGIN");
      const result = await callback(this.db);
      await this.db.query("COMMIT");
      return result;
    } catch (error) {
      await this.db.query("ROLLBACK");
      throw error;
    }
  }
}
