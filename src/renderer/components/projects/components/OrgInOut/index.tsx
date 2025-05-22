import { OrganizationPartProvider } from "@/renderer/contexts/OrganizationContext";
import { useMergerContext } from "../../merger/context/MergerContext";
import { useProjectContext } from "@/renderer/contexts/ProjectContext";
import OrgNodeTool from "../OrgNodeTool";
import OrgNodeDetail from "../OrgNodeDetail";

const OrgInOut = ({ groupPart, groupChild, ...prop }: any) => {
  const { projectInfo } = useProjectContext();
  const {
    groupData,
    setGroupData,
    groupChild: contextGroupChild,
    groupPart: contextGroupPart,
    setGroupPart: contextSetGroupPart,
  } = useMergerContext();

  return (
    <div className="h-full">
      <OrganizationPartProvider
        projectInfo={projectInfo}
        groupPart={contextGroupPart?.guid ? contextGroupPart : groupPart}
      >
        <div className="h-full flex flex-col">
          <OrgNodeTool
            groupPart={(contextGroupPart?.guid ? contextGroupPart : groupPart) ?? {}}
            groupChild={(contextGroupChild?.length ? contextGroupChild : groupChild) ?? []}
          />
          <OrgNodeDetail
            groupPart={(contextGroupPart?.guid ? contextGroupPart : groupPart) ?? {}}
            groupChild={(contextGroupChild?.length ? contextGroupChild : groupChild) ?? []}
            projectInfo={projectInfo}
            updateGroupPart={contextSetGroupPart}
          />
        </div>
      </OrganizationPartProvider>
    </div>
  );
};

export default OrgInOut;
