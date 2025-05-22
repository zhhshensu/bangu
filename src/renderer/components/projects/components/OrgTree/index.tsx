// import { Tree } from "primereact/tree";
import { Button, Input, Tooltip, Tree } from "antd";
import { useMergerContext } from "../../merger/context/MergerContext";
import { convertToTree, getFlattenedTree } from "../../helper/org-node-util";
import { useCallback, useRef, useState } from "react";
import { SearchOutlined, SyncOutlined, FolderOutlined, FileTextOutlined } from "@ant-design/icons";
import { throttle } from "lodash-es";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useProjectContext } from "@/renderer/contexts/ProjectContext";
import qs from "query-string";

const OrgTree = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const { projectInfo } = useProjectContext();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { groupData, setGroupData, setGroupPart, setGroupChild } = useMergerContext();

  const projectId = params.projectId || "";

  const preGroupPartRef = useRef<any>(null);

  const data: any = convertToTree(groupData);

  const handleSearchThrottled = useCallback(
    throttle((searchValue: any) => {
      setSearchValue(searchValue); // 立即更新本地状态
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleSearchThrottled(newValue); // 触发节流搜索
  };

  const titleRender = useCallback((nodeData: any) => {
    return (
      <div className="py-1">
        <div className="flex-1 flex items-center rounded gap-2 w-full">
          <div>{nodeData.leaf ? <FileTextOutlined /> : <FolderOutlined />}</div>
          {nodeData.label}
        </div>
      </div>
    );
  }, []);

  const onSelectItem = useCallback((selectedKeys, { node }) => {
    const newGroupPart = node;
    if (preGroupPartRef.current?.guid === newGroupPart.guid) {
      return;
    }
    preGroupPartRef.current = newGroupPart;
    setGroupPart(newGroupPart);
    // 获取所有子节点, 跳过自己
    const result = getFlattenedTree(newGroupPart.guid, groupData, true);
    if (Array.isArray(result)) {
      setGroupChild(result);
    }
    if (newGroupPart?.guid) {
      // 重置，返回当前路由
      navigate({
        to: `/projects/$projectId/merger/$orgId`,
        params: { projectId, orgId: newGroupPart.guid },
        search: qs.stringify({
          guid: newGroupPart.guid,
          projectCode: projectInfo.project_code,
        }),
        // 替换
        replace: true,
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 px-2 pt-2  items-center justify-between">
        <div></div>
        <Tooltip title={"刷新"}>
          <Button
            type="text"
            icon={<SyncOutlined spin={loading} />}
            onClick={async () => {
              // await refresh();
            }}
          ></Button>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-2">
          <Input
            style={{
              maxWidth: "100%",
              minWidth: "120px",
              borderRadius: 4,
            }}
            prefix={<SearchOutlined />}
            size="middle"
            onChange={(e) => handleInputChange(e)}
            placeholder={"搜索"}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <Tree
            showIcon={true}
            treeData={data}
            titleRender={titleRender}
            blockNode
            onSelect={onSelectItem}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgTree;
