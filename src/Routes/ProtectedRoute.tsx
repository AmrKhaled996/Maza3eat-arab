import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/Auth";
import { useLocale } from "../i18n/useLocale";
import { localizedPath } from "../i18n/paths";

/**
 * ProtectedRoute wrapper — redirects to login if user is not authenticated
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const { lang } = useLocale();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={localizedPath(lang, "login")} replace />;
  }

  return <Outlet />;
}
