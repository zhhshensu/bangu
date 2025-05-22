import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Project } from "../services/ProjectService";

export interface ProjectContextProps {
  projectInfo: Project;
  updateProjectInfo: (data: Record<string, unknown>) => void;
}

export const ProjectDefaultValue = {
  projectInfo: {
    zcbfid: "",
    project_code: "",
    project_name: "",
  },
};
const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

interface ProjectProviderProps {
  projectInfo: Project;
  children: React.ReactNode;
}

// 实现 Provider 组件
export function ProjectProvider({ children, ...props }: ProjectProviderProps) {
  const [info, setInfo] = useState<any>(props.projectInfo || ProjectDefaultValue.projectInfo);

  const updateProjectInfo = (data: Record<string, any>) => {
    setInfo((prev) => ({
      ...prev,
      ...data,
    }));
  };

  useEffect(() => {
    if (props?.projectInfo?.project_code) {
      updateProjectInfo(props?.projectInfo);
    }
  }, [props?.projectInfo?.project_code]);

  return (
    <ProjectContext.Provider value={{ projectInfo: info, updateProjectInfo }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
