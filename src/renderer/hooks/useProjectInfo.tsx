import { useEffect, useState } from "react";
import { Project, ProjectService } from "../services/ProjectService";

const useProjectInfo = ({ projectCode }: { projectCode: string }) => {
  const [info, setInfo] = useState<Project>({});

  useEffect(() => {
    if (projectCode) {
      ProjectService.getProjectInfo(projectCode).then((info) => {
        setInfo(info as any);
      });
    }
  }, [projectCode]);

  return info;
};

export default useProjectInfo;
