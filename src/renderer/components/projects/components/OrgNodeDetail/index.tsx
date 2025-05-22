import qs from "query-string";
import React, {
  ComponentType,
  LazyExoticComponent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOrganizationContext } from "@/renderer/contexts/OrganizationContext";
import { Outlet, useLocation, useNavigate, useSearch } from "@tanstack/react-router";

// Define the type for the LazyComponents mapping
type LazyComponentsType = {
  [key: string]: LazyExoticComponent<ComponentType<any>>;
};

// Import the components directly - using actual paths in the project
const LazyComponents: LazyComponentsType = {
  // Using the paths that exist in your project structure
  trialBalance: React.lazy(() => import("@/renderer/components/projects/trialBalance")),
};

// Helper function to get component by key
const getComponentByKey = (key: string) => {
  // If the component exists in our mapping, return it
  if (LazyComponents[key]) {
    return LazyComponents[key];
  }

  // Otherwise, return a placeholder component
  return () => (
    <div className="p-4">
      <Empty description={`组件 "${key}" 未找到，请配置对应组件映射`} />
    </div>
  );
};

export type OrganizationProps = {
  [key: string]: any;
  updateGroupPart?: (groupPart: any) => void;
};

const OrgNodeDetail = ({
  projectInfo,
  groupPart,
  updateGroupPart,
  ...props
}: OrganizationProps) => {
  const location = useLocation();
  const searchParams = useSearch({ strict: false });
  const [current, setCurrent] = useState<any>("");
  const navigate = useNavigate();
  const { structTreeData: groupData, updateTreeData } = useOrganizationContext();

  const [query, setQuery] = useState<any>(searchParams);
  const [step, setStep] = useState<any>(1);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (groupPart.templateInit || groupPart.localExistsData) {
      setStep(2);
      if (groupPart.localExistsData) {
        setStep(3);
      }
    } else {
      setStep(1);
    }
  }, [groupPart]);

  useEffect(() => {
    setQuery(searchParams);
  }, [searchParams]);

  const { menuMode = "horizontal", historyMode = "tab", position } = query;

  const { zcbfid = "", mergeType = "" } = groupPart;

  // 更新groupPart的方法
  const updateCurrentGroupPart = useCallback(
    (newGroupPartData: any) => {
      if (updateGroupPart) {
        // 深拷贝确保不会直接修改原对象
        const updatedGroupPart = {
          ...groupPart,
          ...newGroupPartData,
        };
        updateGroupPart(updatedGroupPart);
      }
    },
    [groupPart, updateGroupPart]
  );

  const getFlatItems = (menus?: any[]): any[] => {
    if (!menus) {
      return [];
    }
    let result: any[] = [];
    menus.forEach((item) => {
      if (item.children && Array.isArray(item.children)) {
        result = result.concat(getFlatItems(item.children));
      } else {
        result.push(item);
      }
    });
    return result;
  };

  const onClickInit = useCallback(async () => {
    // 初始化
    if (groupPart) {
      //加初始化模板功能
      setLoading(true);
      setLoadingText("正在从模板初始化数据,请稍候...");
      //初始化模板
      try {
        // 更新groupPart，标记已初始化
        if (updateCurrentGroupPart) {
          updateCurrentGroupPart({ templateInit: true }); // 模板初始化
          updateTreeData((data: any) => {
            return data.map((item: any) => {
              if (item.guid === groupPart.guid) {
                item.templateInit = true;
              }
              return item;
            });
          });
          setStep(2);
          // 打开数据
          onTabChange(current, 2);
        }
      } catch (error) {
      } finally {
        setLoading(false);
        setLoadingText("");
      }
    }
  }, [groupPart, step, current, updateCurrentGroupPart, updateTreeData]);

  const itemsData = useMemo(() => {
    let items = [];
    return {
      items,
      flatItems: getFlatItems(items),
    };
  }, [groupPart]);

  const onTabChange = useCallback(
    (key: string, step: number) => {
      if ([1].includes(step)) {
        setCurrent(key);
        return;
      }
      if (historyMode === "tab") {
        setCurrent(key);
        return;
      }
      try {
        if (historyMode === "browser") {
          setCurrent(key);
          const targetItem = itemsData.flatItems.find((item) => item.key === key);

          if (targetItem) {
            query.menuposition = key;
            navigate({
              pathname: `${targetItem.path}`,
              search: qs.stringify({
                guid: groupPart.guid,
                projectCode: projectInfo.projectCode,
                groupId: groupPart.guid,
                groupType: Number(groupByMerge(groupPart.mergeType)),
                mergeType: groupPart.mergeType,
                menuposition: key,
                zcbfid: groupPart.zcbfid,
                menuMode: "inline", // inline or vertical or horizontal 菜单的位置
              }),
              replace: true,
            });
          }
        }
      } catch (error) {}
    },
    [itemsData, groupPart]
  );

  useEffect(() => {
    if (itemsData?.flatItems?.length > 0) {
      onTabChange(itemsData?.flatItems[0].key, step);
    }
  }, [itemsData, step, groupPart]);

  const getContent = useMemo(() => {
    return (
      <>
        {groupPart.guid && (
          <>
            {itemsData.items.map((item: any) => {
              const key = item.key as string;
              // Use the fallback instead of trying to dynamically import
              const Component = getComponentByKey(key);
              if (historyMode === "tab") {
                return null;
                // return (
                //   <Tabs.TabPane tab={item.label} key={key}>
                //     <div className="relative h-full" key={key + groupPart.guid}>
                //       <Suspense>
                //         <Component />
                //       </Suspense>
                //     </div>
                //   </Tabs.TabPane>
                // );
              }
              return null;
              // return <Tabs.TabPane tab={item.label} key={key} />;
            })}
          </>
        )}
      </>
    );
  }, [itemsData, groupPart]);

  return (
    <div className="window-frame flex-1 overflow-hidden flex flex-col">
      {groupPart.guid ? (
        <>
          {[1].includes(step) ? (
            <div className="px-4">
              {/* <Spin spinning={loading} delay={500} tip={loadingText}>
                <Tabs
                  tabBarStyle={{
                    paddingLeft: 0,
                    marginBottom: 8,
                  }}
                  onChange={(activeKey: string) => {
                    onTabChange(activeKey, step);
                  }}
                  activeKey={current}
                  items={itemsData.items.map((item: any) => {
                    item.children = (
                      <DetailStep step={step} onClickInit={onClickInit} groupPart={groupPart} />
                    );
                    return item;
                  })}
                />
              </Spin> */}
            </div>
          ) : (
            <>
              <div className="px-2 h-full">
                {/* <Tabs
                  style={{
                    height: historyMode === "tab" ? "100%" : "46px", // 覆盖样式，达到不显示tabPane
                  }}
                  tabBarStyle={{
                    paddingLeft: 0,
                    marginBottom: 8,
                  }}
                  onChange={(activeKey: string) => {
                    onTabChange(activeKey, step);
                  }}
                  activeKey={current}
                >
                  {getContent}
                </Tabs> */}
              </div>
              {historyMode !== "tab" && (
                <div className="p-4 bg-white relative flex-1 overflow-hidden">
                  <Suspense>
                    <Outlet></Outlet>
                  </Suspense>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // <>{groupData.length > 0 && <DetailIntro />}</>
        <></>
      )}
    </div>
  );
};

export default OrgNodeDetail;
