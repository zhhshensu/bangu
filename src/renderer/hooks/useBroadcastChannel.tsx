import { useCallback, useEffect, useRef, useState } from 'react';

type MessageHandler<T = unknown> = (data: T, origin: MessageEventSource | null) => void;

//所有通信页签必须符合同源策略（相同协议、域名、端口）
// 兼容现代浏览器（Chrome 54+、Firefox 38+、Edge 79+），不支持 IE
// 数据需可序列化为 JSON（不支持函数、循环引用等）。
export function useBroadcastChannel<T = unknown>(channelName: string, handler?: MessageHandler<T>) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const handlerRef = useRef(handler);

  // 更新处理函数
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // 初始化频道
  useEffect(() => {
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;
    setIsConnected(true);

    const messageHandler = (event: MessageEvent<T>) => {
      handlerRef.current?.(event.data, event.source);
    };

    channel.addEventListener('message', messageHandler);

    return () => {
      channel.removeEventListener('message', messageHandler);
      channel.close();
      setIsConnected(false);
    };
  }, [channelName]);

  // 发送消息
  const postMessage = useCallback((data: T, options?: { skipSelf?: boolean }) => {
    if (!channelRef.current) return;

    if (options?.skipSelf) {
      const originalHandler = handlerRef.current;
      handlerRef.current = undefined;
      channelRef.current.postMessage(data);
      setTimeout(() => {
        handlerRef.current = originalHandler;
      }, 0);
    } else {
      channelRef.current.postMessage(data);
    }
  }, []);

  return { postMessage, isConnected };
}
