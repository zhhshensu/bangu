import OrgTree from "../components/OrgTree";
import OrgInOut from "../components/OrgInOut";
import { useEffect, useState } from "react";
import { MergerProvider, useMergerContext } from "./context/MergerContext";
import { OrgService } from "@/renderer/services/OrgService";
import { useParams } from "@tanstack/react-router";
import { OrganizationProvider } from "@/renderer/contexts/OrganizationContext";

import { Splitter } from "antd";

const MergerContent = () => {
  const params = useParams({ strict: false });
  const [projectId, setProjectId] = useState("");
  const { setGroupData } = useMergerContext();

  const getAllOrg = async (projectId: string) => {
    const result = await OrgService.getAllOrgs(projectId);
    setGroupData(result);
  };

  useEffect(() => {
    if (params.projectId) {
      setProjectId(params.projectId);
    }
  }, [params.projectId]);

  useEffect(() => {
    if (projectId) {
      getAllOrg(projectId);
    }
  }, [projectId]);

  return (
    <OrganizationProvider projectCode={projectId}>
      <Splitter className="h-full flex !border-none">
        <Splitter.Panel size={"300px"} min={"10%"} max={"75%"}>
          <OrgTree />
        </Splitter.Panel>
        <Splitter.Panel>
          <OrgInOut />
        </Splitter.Panel>
      </Splitter>
    </OrganizationProvider>
  );
};

const Merger = () => {
  const [initialGroupPart, setInitialGroupPart] = useState<any>({});
  const [initialGroupChild, setInitialGroupChild] = useState<any[]>([]);

  return (
    <MergerProvider initialGroupPart={initialGroupPart} initialGroupChild={initialGroupChild}>
      <MergerContent />
    </MergerProvider>
  );
};

export default Merger;
