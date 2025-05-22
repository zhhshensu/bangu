import { PGlite } from "@electric-sql/pglite";
import { Migration } from ".";

export const migration: Migration = {
  version: 1,
  name: "initial_schema",
  up: async (db: PGlite) => {
    // 创建项目表
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_code VARCHAR(50) PRIMARY KEY,
        project_name TEXT,
        trade VARCHAR(100),
        type VARCHAR(50),
        department_id VARCHAR(50),
        department_name TEXT,
        customer_id VARCHAR(50),
        customer_name VARCHAR(100),
        project_category VARCHAR(50),
        project_year VARCHAR(10),
        start_quarter VARCHAR(50),
        start_amount VARCHAR(50),
        project_state INTEGER,
        edit_user VARCHAR(50),
        edit_date TIMESTAMP,
        third_id VARCHAR(100),
        db_name VARCHAR(20),
        edit_user_name VARCHAR(50),
        short_name VARCHAR(100),
        receive_person VARCHAR(100),
        report_type VARCHAR(100),
        audit_report_template VARCHAR(100),
        audit_report_date VARCHAR(30),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建索引
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_project_name ON projects(project_name);
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_department_id ON projects(department_id);
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
    `);

    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_project_state ON projects(project_state);
    `);
  },
  down: async (db: PGlite) => {
    // 删除索引
    await db.query(`DROP INDEX IF EXISTS idx_projects_project_name;`);
    await db.query(`DROP INDEX IF EXISTS idx_projects_department_id;`);
    await db.query(`DROP INDEX IF EXISTS idx_projects_customer_id;`);
    await db.query(`DROP INDEX IF EXISTS idx_projects_project_state;`);

    // 删除表
    await db.query(`DROP TABLE IF EXISTS projects;`);
  },
};
