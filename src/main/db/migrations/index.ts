import { PGlite } from "@electric-sql/pglite";

export interface Migration {
  version: number;
  name: string;
  up: (db: PGlite) => Promise<void>;
  down?: (db: PGlite) => Promise<void>;
}

// 创建迁移版本记录表
const createMigrationTable = async (db: PGlite) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        version INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.log(`🚀--Nice ~ createMigrationTable ~ error:`, error);
  }
};

// 获取当前数据库版本
const getCurrentVersion = async (db: PGlite): Promise<number> => {
  try {
    const result: any = await db.query("SELECT MAX(version) as version FROM migrations");
    return result.rows[0]?.version || 0;
  } catch (error) {
    // 如果表不存在，返回 0
    return 0;
  }
};

// 记录已执行的迁移
const recordMigration = async (db: PGlite, migration: Migration) => {
  await db.query("INSERT INTO migrations (version, name) VALUES ($1, $2)", [
    migration.version,
    migration.name,
  ]);
};

// 执行迁移
export const runMigrations = async (db: PGlite, migrations: Migration[]) => {
  try {
    await createMigrationTable(db);
    // const currentVersion = await getCurrentVersion(db);

    // // 按版本号排序迁移
    // const pendingMigrations = migrations
    //   .filter((m) => m.version > currentVersion)
    //   .sort((a, b) => a.version - b.version);

    // for (const migration of pendingMigrations) {
    //   try {
    //     await db.query("BEGIN");
    //     await migration.up(db);
    //     await recordMigration(db, migration);
    //     await db.query("COMMIT");
    //     console.log(`Migration ${migration.version}: ${migration.name} completed`);
    //   } catch (error) {
    //     await db.query("ROLLBACK");
    //     console.error(`Migration ${migration.version}: ${migration.name} failed:`, error);
    //     throw error;
    //   }
    // }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};
