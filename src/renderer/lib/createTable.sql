
CREATE TABLE IF NOT EXISTS orgs (
    zcbfid VARCHAR(50) PRIMARY KEY,  -- 主键，唯一标识符
    audit_report_date DATE,  -- 审计报告日期（原auditReportDate）[1,7](@ref)
    audit_report_template VARCHAR(255) NOT NULL,  -- 审计报告模板（原auditReportTemplate）
    create_at TIMESTAMP NOT NULL,  -- 创建时间（原createTime）
    create_user VARCHAR(20) NOT NULL,  -- 创建用户ID（原createUser）
    customer_name VARCHAR(255) NOT NULL,  -- 客户全称（原customerName）[2,7](@ref)
    enabled BOOLEAN NOT NULL DEFAULT TRUE,  -- 启用状态（原enabled）
    from_type INTEGER NOT NULL,  -- 来源类型（原fromType）
    guid VARCHAR(36) NOT NULL UNIQUE,  -- 全局唯一标识符（原guid）
    is_audit_report BOOLEAN NOT NULL DEFAULT FALSE,  -- 是否审计报告（原isAuditReport，布尔化优化）
    is_merge BOOLEAN NOT NULL,  -- 是否合并（原isMerge）
    is_self_audit BOOLEAN NOT NULL,  -- 是否自审（原isSelfAudit）
    merge_end_date DATE,  -- 合并截止日期（原mergeEndDate）
    merge_start_date DATE,  -- 合并开始日期（原mergeStartDate）
    merge_type VARCHAR(10) NOT NULL,  -- 合并类型编码（原mergeType）
    merge_use_report_template VARCHAR(255),  -- 合并使用模板（原mergeUseReportTemplate）
    one_year_period_sdb_style VARCHAR(1) NOT NULL,  -- 年度期间样式（原oneYearPeriodSdbStyle）
    order_index INTEGER NOT NULL DEFAULT -9,  -- 排序索引（原orderIndex）
    parent_id VARCHAR(50),  -- 父级ID（原parentId，建议外键约束）[5,7](@ref)
    project_code VARCHAR(20) NOT NULL,  -- 项目编码（原projectCode）
    project_name VARCHAR(255) NOT NULL,  -- 项目名称（原projectName）
    receive_person VARCHAR(100),  -- 接收人（原receivePerson）
    relate_cloud_status INTEGER NOT NULL DEFAULT 1,  -- 关联云端状态（原relateCloudStatus）
    remarks TEXT,  -- 备注（原remarks）
    report_end_month VARCHAR(6),  -- 报告截止月份（原reportEndMonth，格式YYYYMM）
    report_type VARCHAR(20) NOT NULL,  -- 报告类型（原reportType）
    share_rate_differ NUMERIC(5,2),  -- 持股比例差异（原shareRateDiffer）
    share_rate_end NUMERIC(5,2),  -- 截止持股比例（原shareRateEnd）
    share_rate_start NUMERIC(5,2),  -- 起始持股比例（原shareRateStart）
    short_name VARCHAR(100) NOT NULL,  -- 客户简称（原shortName）
    sjnd VARCHAR(4) NOT NULL  -- 数据年度（原sjnd，如"2021"）
);

CREATE OR REPLACE FUNCTION generate_zcbfid()
RETURNS TRIGGER AS $$
DECLARE
    parent_zcbfid TEXT;
    max_child_number INT;
    new_child_number TEXT;
BEGIN
    -- 场景1: 插入根节点
    IF NEW.parent_id IS NULL THEN
        NEW.zcbfid := NEW.project_code;
    ELSE
        -- 锁定父节点，避免并发冲突
        PERFORM 1 FROM orgs WHERE guid = NEW.parent_id FOR UPDATE;

        -- 获取父节点 zcbfid
        SELECT zcbfid INTO parent_zcbfid
        FROM orgs
        WHERE guid = NEW.parent_id;

        -- 查询父节点下的最大子节点序号
        SELECT MAX(CAST(split_part(zcbfid, '-', -1) AS INTEGER))
        INTO max_child_number
        FROM orgs
        WHERE parent_id = NEW.parent_id;

        -- 计算新序号
        IF max_child_number IS NULL THEN
            max_child_number := 0;
        END IF;
        new_child_number := LPAD((max_child_number + 1)::TEXT, 3, '0');

        -- 生成子节点 zcbfid
        NEW.zcbfid := parent_zcbfid || '-' || new_child_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_zcbfid
BEFORE INSERT ON orgs
FOR EACH ROW EXECUTE FUNCTION generate_zcbfid();