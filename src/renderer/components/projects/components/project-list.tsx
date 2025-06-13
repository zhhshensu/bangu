import { useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { Button, Modal, Spin } from "antd";
import { useTranslation } from "react-i18next";

type ProjectListProps = {
  searchText: string;
  height: number;
};
const ProjectList = ({ searchText, height }: ProjectListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<any[]>([]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // const data = await ProjectService.getAllProjects({
      //   searchText,
      // });
      setList([]);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  useEffect(() => {
    onLoadMore();
  }, [searchText]);

  const filterList = useMemo(() => {
    if (list.length === 0) return [];

    let filteredList = searchText
      ? list.filter(({ project_name, project_code }) => {
          return (
            (project_name ?? "").includes(searchText) || (project_code ?? "").includes(searchText)
          );
        })
      : [...list];

    return filteredList;
  }, [searchText, list]);

  const onLoadMore = () => {
    loadProjects();
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === height) {
      onLoadMore();
    }
  };

  const startProject = (item: any) => {
    Modal.confirm({
      content: `已选择【${item.project_code}】【${item.project_name}】项目`,
      okText: t("start"),
      onOk: async function () {
        try {
          navigate({
            to: `/projects/${item.project_code}/basicInfo`,
          });
        } catch (error) {}
      },
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin />
        </div>
      ) : (
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {filterList.map((item: any, inx) => (
              <div
                key={inx}
                className="cursor-pointer group relative overflow-hidden  rounded-md
            bg-[var(--background-left-navigation-web)] transition-all duration-300 hover:border-[var(--border-color)] border border-transparent"
              >
                {item?.project_image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src="image.jpg"
                      alt="卡片封面"
                      className="h-48 w-full object-cover md:h-56 lg:h-64"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </div>
                )}

                <div className="p-4">
                  <h4 className="text-gray-900 line-clamp-2">
                    【{item.project_code}】{item.project_name}
                  </h4>
                  {/* <p className="mb-4 text-gray-600 line-clamp-3">{item.customer_name}</p> */}
                </div>

                <div className="flex justify-end px-2 py-2">
                  <Button type="text" onClick={() => startProject(item)}>
                    {t("start") + "" + t("project")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectList;
