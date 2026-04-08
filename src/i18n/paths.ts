import type { SupportedLocale } from "./config";

/** Path without leading locale segment, e.g. `featured`, `post/123`, `q&a` */
export function localizedPath(lang: SupportedLocale, path: string): string {
  const trimmed = path.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!trimmed) return `/${lang}`;
  return `/${lang}/${trimmed}`;
}
