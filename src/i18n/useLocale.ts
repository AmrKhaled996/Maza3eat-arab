import { useOutletContext } from "react-router-dom";
import { DEFAULT_LOCALE, type SupportedLocale } from "./config";

export type LocaleOutletContext = { lang: SupportedLocale };

export function getLocale(): SupportedLocale {
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    if (seg === "ar" || seg === "en") return seg;
    try {
      const stored = localStorage.getItem("maza3eat-locale");
      if (stored === "ar" || stored === "en") return stored as SupportedLocale;
    } catch {
      /* ignore */
    }
  }
  return DEFAULT_LOCALE;
}

export function useLocale(): LocaleOutletContext {
  const ctx = useOutletContext<LocaleOutletContext>();
  if (ctx?.lang) return ctx;
  return { lang: getLocale() };
}
