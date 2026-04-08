import { useOutletContext } from "react-router-dom";
import { DEFAULT_LOCALE, type SupportedLocale } from "./config";

export type LocaleOutletContext = { lang: SupportedLocale };

export function useLocale(): LocaleOutletContext {
  const ctx = useOutletContext<LocaleOutletContext>();
  if (ctx?.lang) return ctx;
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    if (seg === "ar" || seg === "en") return { lang: seg };
    try {
      const stored = localStorage.getItem("maza3eat-locale");
      if (stored === "ar" || stored === "en") return { lang: stored };
    } catch {
      /* ignore */
    }
  }
  return { lang: DEFAULT_LOCALE };
}
