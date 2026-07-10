import React from "react";
import { NavLink, Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  FileText,
  HelpCircle,
  Tags,
  AlertTriangle,
  Award,
  Megaphone,
  LogOut,
  ArrowLeft,
  Image,
} from "lucide-react";
import { useAuth } from "../../Context/Auth";
import { localizedPath } from "../../i18n/paths";
import cn from "../../utils/Cn";

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const lang = i18n.language;
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const goLocale = (next: string) => {
    const nextPath = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${next}`);
    navigate(`${nextPath}${search}${hash}`, { flushSync: true });
  };

  const menuItems = [
    { to: localizedPath(lang, "admin"), icon: LayoutDashboard, label: t("admin.dashboard"), end: true },
    { to: localizedPath(lang, "admin/users"), icon: Users, label: t("admin.users") },
    { to: localizedPath(lang, "admin/posts"), icon: FileText, label: t("admin.posts") },
    { to: localizedPath(lang, "admin/questions"), icon: HelpCircle, label: t("admin.questions") },
    { to: localizedPath(lang, "admin/tags"), icon: Tags, label: t("admin.tags") },
    { to: localizedPath(lang, "admin/reports"), icon: AlertTriangle, label: t("admin.reports") },
    { to: localizedPath(lang, "admin/tiers"), icon: Award, label: t("admin.tiers") },
    { to: localizedPath(lang, "admin/ads"), icon: Image, label: t("admin.ads") },
    { to: localizedPath(lang, "admin/announcements"), icon: Megaphone, label: t("admin.announcements", "Announcements") },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-e border-gray-200 flex flex-col fixed inset-y-0 start-0 z-10">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full main-gradient flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <span className="font-bold text-xl text-primary tracking-wide">Maza3eat Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="flex items-center gap-3 px-2">
            {user?.avatar ? (
              <img src={user.avatar} alt="admin" className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-100" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate w-32">{user?.name}</span>
              <span className="text-xs text-gray-500 uppercase">{user?.role}</span>
            </div>
          </div>
          <Link to={localizedPath(lang, "")} className="flex items-center gap-2 text-primary hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors font-medium text-sm">
            <ArrowLeft className="w-5 h-5" /> {t("admin.backToSite", "Back to Site")}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("login.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ms-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Admin Area</h1>
          
          <div
            className="flex rounded-full border border-gray-200 bg-white px-1 py-0.5 text-xs font-bold"
            role="group"
          >
            <button
              type="button"
              onClick={() => goLocale("ar")}
              className={cn(
                "rounded-full px-3 py-1 transition-colors ",
                lang === "ar"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {t("lang.shortAr")}
            </button>
            <button
              type="button"
              onClick={() => goLocale("en")}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                lang === "en"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {t("lang.shortEn")}
            </button>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
