import { Navigate, useLocation } from "react-router-dom";
import { DEFAULT_LOCALE } from "../i18n/config";
import { localizedPath } from "../i18n/paths";

/**
 * Sends legacy paths (no locale prefix) to the default locale.
 * Example: `/featured` -> `/ar/featured`
 */
export default function LegacyRedirect() {
  const { pathname, search, hash } = useLocation();

  if (
    pathname === "/ar" ||
    pathname.startsWith("/ar/") ||
    pathname === "/en" ||
    pathname.startsWith("/en/")
  ) {
    return <Navigate to={localizedPath(DEFAULT_LOCALE, "")} replace />;
  }

  const base = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return (
    <Navigate
      to={`${localizedPath(DEFAULT_LOCALE, base)}${search}${hash}`}
      replace
    />
  );
}
