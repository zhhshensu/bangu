import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * 检测元素高度
 * @param target
 * @returns
 */
export const useElementResizeHeight = (target: HTMLElement) => {
  const [elementResizeHeight, setElementResizeHeight] = useState<any>(target?.offsetHeight || 0); // 目标元素宽度
  const roRef = useRef<any>();
  const resizeUpdate = () => {
    if (target) {
      if (!roRef.current) {
        roRef.current = {};
      }
      roRef.current.container = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          setElementResizeHeight(cr.height);
        }
      });
      roRef.current.container.observe(target as HTMLElement);

      roRef.current.el = target;
    }
  };

  useLayoutEffect(() => {
    resizeUpdate();
    return () => {
      if (roRef.current) {
        roRef.current.container.unobserve(roRef.current.el);
        roRef.current = null;
      }
    };
  }, [target]);

  return {
    elementResizeHeight,
  };
};
