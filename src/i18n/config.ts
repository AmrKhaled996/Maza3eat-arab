import i18n from "i18next";

import arCommon from "./resources/ar/common.json";
import enCommon from "./resources/en/common.json";
import { initReactI18next } from "react-i18next";


export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "ar";

void i18n.use(initReactI18next).init({
  resources: {
    ar: { common: arCommon },
    en: { common: enCommon },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
