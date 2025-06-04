import { Tooltip } from "antd";
import type { TooltipProps } from "antd";

interface SidebarItem {
  key: string;
  icon: any;
  title?: string;
  label: string;
}

interface SidebarProps {
  style?: React.CSSProperties;
  items: SidebarItem[];
  activeKey: string;
  onItemClick?: (key: string, item: SidebarItem) => void;
  tooltipProps?: TooltipProps;
  showLabel?: boolean;
}

const Sidebar = ({ style, items, showLabel, activeKey, tooltipProps, ...props }: SidebarProps) => {
  return (
    <div className="flex flex-col space-y-1 p-1 bg-[var(--background-left-navigation-web)]">
      {items.map((item: any) => (
        <div
          key={item.key}
          title={item.title}
          style={style}
          className={`
            w-full flex flex-col items-center justify-center p-2 rounded-md cursor-pointer
            transition-colors duration-200
            hover:bg-[var(--sidebar-hover-bg)]
            ${
              activeKey === item.key
                ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]"
                : "text-[var(--sidebar-text)]"
            }
          `}
          onClick={() => {
            props.onItemClick?.(item.key, item);
          }}
        >
          <Tooltip title={item.title} placement="right" {...tooltipProps}>
            <div className="flex flex-col items-center justify-center">
              <div
                className={`text-xl ${
                  activeKey === item.key
                    ? "text-[var(--sidebar-active-text)]"
                    : "text-[var(--sidebar-icon)]"
                }`}
              >
                {item.icon || <div className="w-6 h-6" />}
              </div>
              {showLabel && (
                <div className="text-xs mt-1 text-center truncate w-full">{item.label}</div>
              )}
            </div>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
