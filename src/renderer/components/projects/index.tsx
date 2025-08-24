import { useElementResizeHeight } from "@/renderer/hooks/useElementResizeHeight";
import { PlayCircleFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Layout, List, Space } from "antd";
import { MenuProps } from "antd/es/menu";
import { ChevronDown, LayoutGrid, LayoutList, TableOfContents } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import ProjectList from "./components/project-list";
import { ProjectService } from "@/renderer/services/ProjectService";
import throttle from "lodash-es/throttle";

const Projects = () => {
  const [searchText, setSerachText] = useState("");

  const ContainerRef = useRef<any>();

  const target = useElementResizeHeight(ContainerRef.current);

  const handleSearchThrottled = useCallback(
    throttle((searchValue) => {
      setSerachText(searchValue); // 立即更新本地状态
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    handleSearchThrottled(newValue); // 触发节流搜索
  };

  return (
    <div className="p-8 flex flex-col h-full">
      <div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
        <div>
          <h3 className="text-xl tracking-tight">全部项目</h3>
          <p className="text-muted-foreground"></p>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-4">
            <Input
              ref={(input) => {
                if (input != null) {
                  input.focus();
                }
              }}
              style={{
                padding: "6px 16px",
                width: 240,
                borderRadius: 4,
              }}
              prefix={<SearchOutlined />}
              variant="filled"
              size="middle"
              onChange={(e) => handleInputChange(e)}
              placeholder={"请输入项目编号或项目名称"}
            />
          </div>
          {/* <Button type="primary" disabled>
            新建 <PlusOutlined />
          </Button> */}
        </div>
      </div>
      {/* 列表 */}
      <div className="flex-1 overflow-auto" ref={ContainerRef}>
        <ProjectList searchText={searchText} height={target.elementResizeHeight} />
      </div>
    </div>
  );
};

export default Projects;
