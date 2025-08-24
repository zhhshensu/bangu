import { useCallback, useEffect, useState } from "react";
import { OrgInfo, OrgService } from "../services/OrgService";

const useOrganization = ({ projectCode }: { projectCode: string }) => {
  const [structTreeData, setStructTreeData] = useState<OrgInfo[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const getGroupTree = async () => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      const rows = await OrgService.getAllOrgs(projectCode);
      const data = rows.sort((a, b) => {
        return a.zcbfid - b.zcbfid;
      });

      setStructTreeData(data);
    } catch (error) {}
    setActionLoading(false);
  };

  // 添加更新树数据的方法
  const updateTreeData = useCallback((updater: (prevData: OrgInfo[]) => OrgInfo[]) => {
    setStructTreeData((prevData) => updater(prevData));
  }, []);

  // 添加直接设置树数据的方法
  const setTreeData = useCallback((newData: OrgInfo[]) => {
    setStructTreeData(newData);
  }, []);

  useEffect(() => {
    if (projectCode) {
      getGroupTree();
    }
  }, [projectCode]);

  return {
    structTreeData,
    refresh: getGroupTree,
    loading: actionLoading,
    updateTreeData,
    setTreeData,
  };
};

export default useOrganization;
