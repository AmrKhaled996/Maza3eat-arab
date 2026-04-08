import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { SupportedLocale } from "../i18n/config";

export default function LocaleShell({ lang }: { lang: SupportedLocale }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("maza3eat-locale", lang);
    } catch {
      /* ignore */
    }
  }, [lang, i18n]);

  return <Outlet context={{ lang }} />;
}
