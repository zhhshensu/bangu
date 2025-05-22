import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

const mainAvailChannels: string[] = ["msgRequestGetVersion", "msgOpenExternalLink", "msgOpenFile"];
const rendererAvailChannels: string[] = [];

contextBridge.exposeInMainWorld("mainApi", {
  showContextMenu: () => ipcRenderer.send("show-context-menu"),
  platform: process.platform, // 直接暴露平台信息
  getPlatformInfo: () => {
    return {
      isMac: process.platform === "darwin",
      isWindows: process.platform === "win32",
      isLinux: process.platform === "linux",
    };
  },
  send: (channel: string, ...data: any[]): void => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data]);
      if (process.env.NODE_ENV === "development") {
        console.log({ type: "send", channel, request: data });
      }
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`);
    }
  },
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, listener);
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`);
    }
  },
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.once(channel, listener);
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`);
    }
  },
  off: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.off(channel, listener);
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`);
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainAvailChannels.includes(channel)) {
      try {
        const result = await ipcRenderer.invoke(channel, ...data);
        if (process.env.NODE_ENV === "development") {
          console.log({ type: "invoke", channel, request: data, result });
        }
        return result;
      } catch (error) {}
    }

    throw new Error(`Unknown ipc channel name: ${channel}`);
  },
});
