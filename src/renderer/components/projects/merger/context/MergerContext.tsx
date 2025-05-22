import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

interface MergerContextType {
  groupPart: any;
  setGroupPart: (groupPart: any) => void;
  groupChild: any[];
  setGroupChild: (groupChild: any[]) => void;
  groupData: any[];
  setGroupData: (groupData: any[]) => void;
}

const MergerContext = createContext<MergerContextType | undefined>(undefined);

export const MergerProvider: React.FC<{
  children: ReactNode;
  initialGroupData?: any[];
  initialGroupPart?: any;
  initialGroupChild?: any[];
}> = ({ children, initialGroupPart = {}, initialGroupChild = [], initialGroupData = [] }) => {
  const [groupData, setGroupData] = useState<any[]>(initialGroupData);
  const [groupPart, setGroupPart] = useState<any>(initialGroupPart);
  const [groupChild, setGroupChild] = useState<any[]>(initialGroupChild);

  return (
    <MergerContext.Provider
      value={{
        groupPart,
        setGroupPart,
        groupChild,
        setGroupChild,
        groupData,
        setGroupData,
      }}
    >
      {children}
    </MergerContext.Provider>
  );
};

export const useMergerContext = (): MergerContextType => {
  const context = useContext(MergerContext);
  if (context === undefined) {
    throw new Error("useMergerContext must be used within a MergerProvider");
  }
  return context;
};
