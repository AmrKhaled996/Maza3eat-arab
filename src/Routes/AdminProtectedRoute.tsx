import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import { useTranslation } from "react-i18next";
import { localizedPath } from "../i18n/paths";

export default function AdminProtectedRoute() {
  const { user, isLoading } = useAuth();
  const { i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "ADMIN") {
    return <Navigate to={localizedPath(i18n.language, "")} replace />;
  }

  return <Outlet />;
}
