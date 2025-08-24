import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { name, version } from "../../../package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class Constants {
  // Display app name (uppercase first letter)
  static APP_NAME = name.charAt(0).toUpperCase() + name.slice(1);

  static APP_VERSION = version;

  static IS_DEV_ENV = process.env.NODE_ENV === "development";

  static IS_MAC = process.platform === "darwin";

  static DEFAULT_WEB_PREFERENCES = {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: join(__dirname, "../preload/index.js"),
  };
  // 自定义titlebar
  static APP_titlebar_DEV = "http://localhost:5175/containers/header/";
  static APP_titlebar_PROD = join(__dirname, "../containers/header/index.html");
  // 主页面
  static APP_INDEX_URL_DEV = "http://localhost:5175";
  static APP_INDEX_URL_PROD = join(__dirname, "../index.html");
}
