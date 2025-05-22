import {
  BaseWindow,
  BrowserWindow,
  type RenderProcessGoneDetails,
  WebContentsView,
  app,
  ipcMain,
  Menu,
  ContextMenuParams,
} from "electron";
import IPCs from "./IPCs";
import Constants from "./utils/Constants";
import { MenuService } from "./services/menuService";

const exitApp = (mainWindow: BrowserWindow): void => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide();
  }
  mainWindow.destroy();
  app.exit();
};

export const createMainWindow = async (
  mainWindow: BrowserWindow,
  mainContentView: WebContentsView
): Promise<BrowserWindow> => {
  mainWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    width: Constants.IS_DEV_ENV ? 1100 : 1100,
    height: 700,
    useContentSize: true,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 10, y: 10 },
    // expose window controls in Windows/Linux
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
  });

  // mainWindow.setMenu(null);

  mainWindow.on("close", (event: Event): void => {
    event.preventDefault();
    exitApp(mainWindow);
  });

  mainWindow.webContents.on("did-frame-finish-load", (): void => {
    if (Constants.IS_DEV_ENV) {
      // mainWindow.webContents.openDevTools();
      // mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  });

  // 主进程初始化时发送当前状态
  mainWindow.webContents.on("did-finish-load", () => {});

  mainWindow.once("ready-to-show", (): void => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
  });
  // 给应用添加菜单
  MenuService.shared.showAppContextMenu(mainWindow);
  // Initialize IPC Communication
  IPCs.initialize();

  if (Constants.IS_DEV_ENV) {
    await mainWindow.loadURL(Constants.APP_titlebar_DEV);
  } else {
    await mainWindow.loadFile(Constants.APP_titlebar_PROD);
  }

  // 动态计算内容区域尺寸
  function resizeViews() {
    const { width, height } = mainWindow.getContentBounds();
    mainContentView.setBounds({
      x: 0,
      y: 42,
      width,
      height: height - 42,
    });
  }
  mainWindow.on("resize", resizeViews);
  // 创建内容视图
  mainContentView = new WebContentsView({
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
  });

  mainWindow.contentView.addChildView(mainContentView);
  resizeViews();

  if (Constants.IS_DEV_ENV) {
    await mainContentView.webContents.loadURL(Constants.APP_INDEX_URL_DEV);
  } else {
    await mainContentView.webContents.loadFile(Constants.APP_INDEX_URL_PROD);
  }
  mainContentView.webContents.on("context-menu", (event: Event, params: ContextMenuParams) => {
    MenuService.shared.showContextMenu(mainContentView, event, params);
  });

  // mainWindow.setMenu(null);
  return mainWindow;
};

export const createErrorWindow = async (
  errorWindow: BrowserWindow,
  mainWindow: BrowserWindow,
  details?: RenderProcessGoneDetails
): Promise<BrowserWindow> => {
  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide();
  }

  errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    resizable: Constants.IS_DEV_ENV,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
  });

  errorWindow.setMenu(null);

  if (Constants.IS_DEV_ENV) {
    await errorWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#/error`);
  } else {
    await errorWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: "error" });
  }

  errorWindow.on("ready-to-show", (): void => {
    if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.destroy();
    }
    errorWindow.show();
    errorWindow.focus();
  });

  errorWindow.webContents.on("did-frame-finish-load", (): void => {
    if (Constants.IS_DEV_ENV) {
      errorWindow.webContents.openDevTools();
    }
  });

  return errorWindow;
};
