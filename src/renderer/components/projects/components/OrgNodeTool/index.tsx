import { EllipsisVertical } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Status, STATUS_CONFIG } from "../../helper/data";
import PublishButton from "./PublishButton";
import UnPublishButton from "./UnPublishButton";
import { useProjectContext } from "@/renderer/contexts/ProjectContext";

import { Dialog } from "primereact/dialog";

import {
  useOrganizationContext,
  useOrganizationPartContext,
} from "@/renderer/contexts/OrganizationContext";

export const menuItems = [
  {
    key: "node-info",
    label: "编辑节点信息",
  },
  {
    key: "divider-one",
    type: "divider",
  },
];

const OrgNodeTool = ({ groupPart, groupChild, ...props }: any) => {
  const { projectInfo } = useProjectContext();
  const { structTreeData: groupData, refresh } = useOrganizationContext();
  const [updateStatus, setUpdateStatus] = useState<any>([]);

  const [activeKey, setActiveKey] = useState(null);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (groupPart) {
      setUpdateStatus(groupPart?.updateStatus || []);
    }
  }, [groupPart]);
  // 显示【提交按钮】
  // 数据存在，且没有提交
  let showSummit =
    updateStatus.length > 0
      ? updateStatus.find((item: any) => ![Status.LOCAL.PUBLISH].includes(item.status))
      : true;
  // 显示【取消提交按钮】
  let showCancelSummit = updateStatus.find((item: any) =>
    [Status.LOCAL.PUBLISH].includes(item.status)
  );

  return (
    <>
      {/* 工具区 */}
      <div className="px-4 flex justify-between">
        <div className="flex items-center">
          节点状态：
          <div className="flex justify-between">
            {updateStatus.map(({ status }: any, inx: number) => {
              return (
                // <Tooltip title={STATUS_CONFIG[status].label} key={inx}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${STATUS_CONFIG[status].color} px-2 py-1 rounded`}>
                    {STATUS_CONFIG[status].label}
                  </span>
                </div>
                // </Tooltip>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {showSummit && groupPart.templateInit && (
            <PublishButton
              type="primary"
              projectInfo={projectInfo}
              cellData={groupPart}
              refresh={refresh}
            ></PublishButton>
          )}
          {showCancelSummit && (
            <UnPublishButton
              type="primary"
              projectInfo={projectInfo}
              cellData={groupPart}
              refresh={refresh}
            />
          )}
          {/* <Divider type="vertical" />
          <Tooltip title="更多" placement="top">
            <Dropdown
              menu={{
                items: menuItems,
                onClick: (e: any) => {
                  setActiveKey(e.key);
                  const targetItem: any = menuItems.find((item: any) => item.key === e.key);
                  if (targetItem) {
                    setTitle(targetItem.label);
                  }
                  setOpen(true);
                },
              }}
              trigger={["hover"]}
              placement="bottomRight"
            >
              <EllipsisVertical size={18} color="#595959" />
            </Dropdown>
          </Tooltip> */}
        </div>
      </div>

      {/* 更多区 */}
      <Dialog
        visible={open}
        maximizable
        style={{
          width: "60vw",
        }}
        onHide={() => {
          setOpen(false);
        }}
        {...props}
      >
        <div className="h-full">
          {
            open && activeKey === "node-info" && null
            // <OrgNodeInfo
            //   onFinished={() => {
            //     refresh();
            //   }}
            // />
          }
        </div>
      </Dialog>
    </>
  );
};

export default OrgNodeTool;
