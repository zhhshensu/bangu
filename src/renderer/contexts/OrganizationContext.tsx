import useOrganization from "@/renderer/hooks/useOrganization";
import type React from "react";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type OrgPartInfo = {
  [key: string]: any;
};

export interface OrgPartContextProps {
  orgPartInfo: OrgPartInfo;
  setOrgPartInfo: (newData: OrgPartInfo) => void;
}

export const DefaultValue = {
  guid: "",
  project_code: "",
  project_name: "",
};
const OrganizationPartContext = createContext<OrgPartContextProps | undefined>(undefined);

interface OrganizationPartProviderProps {
  projectInfo: any;
  groupPart: any;
  children: React.ReactNode;
}

// 实现 Provider 组件
export function OrganizationPartProvider({
  children,
  groupPart,
  ...props
}: OrganizationPartProviderProps) {
  const [info, setInfo] = useState<OrgPartInfo>(DefaultValue);

  const setOrgPartInfo = useCallback((newData: OrgPartInfo) => {
    setInfo(newData);
  }, []);

  const init = async () => {
    let data = groupPart || {};
    if (data.guid) {
      const curPart = {
        ...groupPart,
      };
      // 修改本地session的存值
      const electronSession = {
        params: curPart,
        session: "persist:local",
      };
      const strElectronSession = JSON.stringify(electronSession);
      window.sessionStorage.setItem("electronParams", strElectronSession);
      setInfo((prev) => ({
        ...prev,
        ...curPart,
      }));
    }
  };

  useEffect(() => {
    if (groupPart?.guid) {
      init();
    }
  }, [groupPart?.guid]);

  return (
    <OrganizationPartContext.Provider value={{ orgPartInfo: info, setOrgPartInfo }}>
      {children}
    </OrganizationPartContext.Provider>
  );
}

export const useOrganizationPartContext = () => {
  const context = useContext(OrganizationPartContext);
  if (!context) {
    throw new Error("useOrganizationPartContext must be used within a OrganizationPartProvider");
  }
  return context;
};

interface OrganizationContextType {
  structTreeData: any[];
  refresh: () => Promise<void>;
  loading: boolean;
  updateTreeData: (updater: (prevData: any[]) => any[]) => void;
  setTreeData: (newData: any[]) => void;
}

interface OrganizationProviderProps {
  children: ReactNode;
  projectCode: string;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
  children,
  projectCode,
}) => {
  const organizationData = useOrganization({ projectCode });

  return (
    <OrganizationContext.Provider value={organizationData}>{children}</OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganizationContext must be used within a OrganizationProvider");
  }
  return context;
};
