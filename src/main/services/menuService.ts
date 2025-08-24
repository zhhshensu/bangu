import { app, BrowserWindow, ContextMenuParams, Menu, MenuItem, WebContentsView } from "electron";

export class MenuService {
  private static instance: MenuService;

  static get shared(): MenuService {
    if (!MenuService.instance) {
      MenuService.instance = new MenuService();
    }
    return MenuService.instance;
  }

  showAppContextMenu(mainWindow: BrowserWindow) {
    // 创建菜单模板
    const template = [
      {
        label: "文件",
        submenu: [
          {
            label: "退出",
            accelerator: process.platform === "darwin" ? "Command+Q" : "Alt+F4",
            click: () => {
              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.hide();
              }
              mainWindow.destroy();
              app.exit();
            },
          },
        ],
      },
      {
        label: "编辑",
        submenu: [
          { label: "撤销", accelerator: "CmdOrCtrl+Z", role: "undo" },
          { label: "重做", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
          { type: "separator" },
          { label: "剪切", accelerator: "CmdOrCtrl+X", role: "cut" },
          { label: "复制", accelerator: "CmdOrCtrl+C", role: "copy" },
          { label: "粘贴", accelerator: "CmdOrCtrl+V", role: "paste" },
          { label: "全选", accelerator: "CmdOrCtrl+A", role: "selectAll" },
        ],
      },
      {
        label: "视图",
        submenu: [
          { role: "reload", label: "刷新" },
          { role: "forceReload", label: "强制刷新" },
          { role: "toggleDevTools", label: "开发者工具" },
          { type: "separator" },
          { role: "resetZoom", label: "重置缩放" },
          { role: "zoomIn", label: "放大" },
          { role: "zoomOut", label: "缩小" },
          { type: "separator" },
          { role: "togglefullscreen", label: "全屏" },
        ],
      },
    ];

    // 设置菜单
    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);
  }

  showContextMenu(mainContentView: WebContentsView, event: Event, params: ContextMenuParams) {
    event.preventDefault();
    const sender = mainContentView.webContents;
    const contextMenuParams = params;

    const template: any = [
      {
        label: "刷新(R)(&R)",
        id: "menuItem_refresh",
        accelerator: "Ctrl+R",
        click: () => {
          sender?.reloadIgnoringCache(); //使用无缓存的方式刷新
        },
      },
      { type: "separator" },
      {
        label: "查看网页源代码(V)(&V)",
        id: "menuItem_viewSource",
        click: () => {
          let url = sender.getURL();
          let window = new BrowserWindow();
          window.title = "查看网页源代码: " + url;
          window.loadURL("view-source:" + url);
          window.on("close", () => (window = null));
        },
      },
      {
        label: "查看框架源代码",
        id: "menuItem_viewSource_iframe",
        click: (
          menuItem: MenuItem,
          browserWindow: BrowserWindow | undefined,
          event: KeyboardEvent
        ) => {
          let url = contextMenuParams.frameURL;
          let window = new BrowserWindow();
          window.title = "查看网页源代码: " + url;
          window.loadURL("view-source:" + url);
          window.on("close", () => (window = null));
        },
      },
      {
        label: "刷新框架",
        id: "menuItem_refresh_iframe",
        click: (
          menuItem: MenuItem,
          browserWindow: BrowserWindow | undefined,
          event: KeyboardEvent
        ) => {
          contextMenuParams.frame.reload(); //刷新框架
        },
      },
      {
        label: "检查(N)(&N)",
        id: "menuItem_inspectElement",
        click: (
          menuItem: MenuItem,
          browserWindow: BrowserWindow | undefined,
          event: KeyboardEvent
        ) => {
          sender.openDevTools({ mode: "right" });
          sender.inspectElement(contextMenuParams.x, contextMenuParams.y);
        },
      },
      {
        label: "属性",
        id: "menuItem_properties",
        click: (
          menuItem: MenuItem,
          browserWindow: BrowserWindow | undefined,
          event: KeyboardEvent
        ) => {
          let url = sender.getURL();
          let frameUrl = contextMenuParams.frameURL; // this.mouseEventArgs.frameElement['src'];
          let msg = `网址: ${url}`;
          if (frameUrl) {
            msg += `\n\r框架: ${frameUrl}`;
          }
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup();
  }
}
