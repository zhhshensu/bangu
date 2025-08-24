import { BrowserWindow, WebContentsViewConstructorOptions, WebContentsView } from "electron";
/**
 * Web 容器选项
 */
export interface WebContainerOptions extends WebContentsViewConstructorOptions {
  /**
   * 是否使用错误视图
   */
  useErrorView?: boolean;
  /**
   * 是否需要使用网页标题和图标
   */
  useHTMLTitleAndIcon?: boolean;
}

/**
 * Web 容器
 */
export class WebContainer {
  /**
   * 唯一 ID
   */
  public readonly id: number;
  /**
   * 封装的视图
   */
  public readonly context: WebContentsView;
  /**
   * 禁用关闭能力
   */
  public disableClose = false;
  /**
   * 配置项
   */
  private options: WebContainerOptions;
  /**
   * 加载地址
   */
  private url?: string;
  /**
   * 是否已初始化
   */
  private initialized = false;

  constructor(options: WebContainerOptions = {}) {
    const defaultOptions: WebContainerOptions = {
      useErrorView: false,
      useHTMLTitleAndIcon: false,
    };
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.context = new WebContentsView(this.options);
    this.context.setBackgroundColor("rgba(255, 255, 255, 0)");
    this.id = this.context.webContents.id;
  }

  /**
   * 加载链接
   * @param url 链接
   */
  public async loadURL(url: string): Promise<void> {
    this.url = url;
    if (!this.initialized) {
      this.setup();
      this.initialized = true;
    }
    this.context.webContents.loadURL(this.url);
  }
  /**
   * 文件加载链接
   * @param url 链接
   */
  public async loadFile(url: string): Promise<void> {
    this.url = url;
    if (!this.initialized) {
      this.setup();
      this.initialized = true;
    }
    this.context.webContents.loadFile(this.url);
  }

  /**
   * 重新加载
   */
  public reload() {
    if (this.url) {
      this.context.webContents.loadURL(this.url);
    } else {
      this.context.webContents.reload();
    }
  }

  /**
   * 设置选项
   * @param options 选项
   */
  public async setOptions(options: WebContainerOptions) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  /**
   * 执行 JS 方法
   */
  public executeJavaScript(script: string) {
    if (this.context?.webContents?.isDestroyed()) {
      return;
    }
    return this.context?.webContents?.executeJavaScript(script).catch((error) => {
      console.error(error);
    });
  }

  /**
   * 获取当前 URL
   */
  public getURL() {
    return this.url;
  }

  private _title = "";
  private _icon = "";

  /**
   * 标题
   */
  public get title() {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get icon() {
    return this._icon;
  }

  public set icon(value: string) {
    this._icon = value;
  }

  // ================ Private Methods ================= //
  private setup() {
    // 配置页面信息
    this.configDocumentInfo();
  }

  private configDocumentInfo() {
    this.context.webContents.on("dom-ready", async () => {
      const title = this.context.webContents.getTitle();
      if (!this.title && title) {
        this.title = title;
      }
      this.icon = await this.executeJavaScript(
        `
          (function() {
          const icon = document.querySelector('link[rel~="icon"]');
          return icon && icon.href || undefined;
          })()
        `
      );
    });
    // 这里可以获取到真实的title
    this.context.webContents.on("page-title-updated", (event, newTitle) => {
      if (newTitle) {
        this.title = newTitle;
      }
    });
  }
}
