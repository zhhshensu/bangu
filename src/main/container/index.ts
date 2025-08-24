import Constants from "../utils/Constants";
import { WebContainer, WebContainerOptions } from "./container";
import { BrowserWindow, WebContentsViewConstructorOptions } from "electron";

export type LoadType = "url" | "file";
/**
 * 容器管理器
 */
class ContainerManager {
  private static instance: ContainerManager;

  static get shared(): ContainerManager {
    if (!ContainerManager.instance) {
      ContainerManager.instance = new ContainerManager();
    }
    return ContainerManager.instance;
  }
  /**
   * 已存在的 containers <id, WebContainer>
   */
  private readonly containers: Map<number, WebContainer>;
  /**
   * 全局选项
   */
  private globalOptions?: WebContentsViewConstructorOptions;

  /**
   * 主窗口
   */
  private _mainWindow: BrowserWindow;

  constructor() {
    this.containers = new Map();
  }

  /**
   * 创建一个 Container
   */
  public createContainer(url: string, type: LoadType, options?: WebContainerOptions): WebContainer {
    const opts = {
      ...(options || {}),
      ...this.globalOptions,
    };
    const webContainer = new WebContainer(opts);
    options && webContainer.setOptions(options);
    this.containers.set(webContainer.id, webContainer);
    if (type === "url") {
      webContainer.webContents.loadURL(url);
    }
    if (type === "file") {
      webContainer.webContents.loadFile(url);
    }
    return webContainer;
  }

  /**
   * 通过 ID 获取容器
   * @param id 容器 ID
   */
  public getContainer(id: number): WebContainer | undefined {
    return this.containers.get(id);
  }

  /**
   * 移除 Container
   * @param url
   */
  public removeContainer(id: number): void {
    const findView = this.containers.get(id);
    if (findView && findView.context.webContents) {
      findView.context.webContents.stop();
      findView.context.webContents.removeAllListeners();
      findView.context.webContents.forcefullyCrashRenderer();
    }
    this.containers.delete(id);
  }

  /**
   * 移除所有 Container
   */
  public removeAllContainers() {
    this.containers.clear();
  }

  /**
   * 配置全局选项
   */
  private configGlobalOptions() {
    this.globalOptions = {
      webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
    };
  }
}

export default ContainerManager;
