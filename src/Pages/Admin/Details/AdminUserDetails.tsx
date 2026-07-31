import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminUserById } from "../../../Apis/AdminApi";
import { safeFormatDate } from "../../../utils/DateFormater";
import { ArrowLeft, User, Calendar, Shield, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { localizedPath } from "../../../i18n/paths";
import { useLocale } from "../../../i18n/useLocale";

export default function AdminUserDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang } = useLocale();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["adminUser", id],
    queryFn: () => getAdminUserById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>;
  if (isError || !user) return <div className="p-8 text-center text-red-500">{t("admin.userNotFound", "User not found")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={localizedPath(lang, "admin/users")} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.userDetails", "User Details")}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-50 shadow-sm" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold`} style={{ backgroundColor: `${user.tier?.badgeColor}20`, color: user.tier?.badgeColor }}>
                <Award className="w-3 h-3 me-1" /> {user.tier?.name}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                <Shield className="w-3 h-3 me-1" /> {user.role}
              </span>
              {user.isBanned && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  {t("admin.banned")}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">{t("admin.accountInfo", "Account Information")}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm flex items-center gap-2"><User className="w-4 h-4" /> {t("admin.id", "ID")}</span>
                <span className="font-mono text-xs text-gray-900">{user.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> {t("admin.joined", "Joined")}</span>
                <span className="text-sm font-medium text-gray-900">{safeFormatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">{t("admin.userStats", "User Statistics")}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">{user.counts?.posts || 0}</div>
                    <div className="text-xs text-blue-600 font-medium uppercase mt-1">{t("admin.posts", "Posts")}</div>
                 </div>
                 <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{user.counts?.questions || 0}</div>
                    <div className="text-xs text-green-600 font-medium uppercase mt-1">{t("admin.questions", "Questions")}</div>
                 </div>
                 <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700">{user.counts?.comments || 0}</div>
                    <div className="text-xs text-purple-600 font-medium uppercase mt-1">{t("admin.comments", "Comments")}</div>
                 </div>
                 <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="text-2xl font-bold text-orange-700">{user.counts?.answers || 0}</div>
                    <div className="text-xs text-orange-600 font-medium uppercase mt-1">{t("admin.answers", "Answers")}</div>
                 </div>
              </div>
           </div>

           {user.isBanned && user.ban && (
             <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t("admin.banDetails", "Ban Details")}
                </h4>
                <div className="text-sm text-red-700 mt-2">
                  <span className="font-semibold">{t("admin.reason", "Reason")}:</span> {user.ban.reason}
                </div>
                <div className="text-xs text-red-500 mt-1">
                  <span className="font-semibold">{t("admin.bannedAt", "Banned at")}:</span> {safeFormatDate(user.ban.createdAt, true)}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
