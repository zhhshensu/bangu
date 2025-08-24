import {
  type RenderProcessGoneDetails,
  type WebContents,
  app,
  BrowserWindow,
  WebContentsView,
} from "electron";
import { createErrorWindow, createMainWindow } from "./MainRunner";
import Constants from "./utils/Constants";
// https://yuanbao.tencent.com/chat/naQivTmsDa/8e3d8ec0-af05-4f38-8d52-8ebe17809926
let mainWindow;
let errorWindow;
let mainContentView;

app.on("ready", async () => {
  if (Constants.IS_DEV_ENV) {
    // import("./index.dev");
  }

  // Disable special menus on macOS by uncommenting the following, if necessary
  /*
  if (Constants.IS_MAC) {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
  }
  */

  mainWindow = await createMainWindow(mainWindow, mainContentView);
});

app.on("activate", async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow(mainWindow, mainContentView);
  }
});

app.on("window-all-closed", () => {
  mainWindow = null;
  errorWindow = null;

  if (!Constants.IS_MAC) {
    app.quit();
  }
});

app.on(
  "render-process-gone",
  (event: Event, webContents: WebContents, details: RenderProcessGoneDetails) => {
    errorWindow = createErrorWindow(errorWindow, mainWindow, details);
  }
);

process.on("uncaughtException", () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow);
});
