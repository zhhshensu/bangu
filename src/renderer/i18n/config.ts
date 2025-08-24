import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "./locales/en-us.json";
import zhCN from "./locales/zh-cn.json";

const defaultLanguage = "en-US";

const resources = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

export const getLanguage = () => {
  return localStorage.getItem("language") || navigator.language || defaultLanguage;
};

export const getLanguageCode = () => {
  return getLanguage().split("-")[0];
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
