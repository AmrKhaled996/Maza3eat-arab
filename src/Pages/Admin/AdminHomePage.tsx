import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminPosts, getAdminQuestions, getAdminReports } from "../../Apis/AdminApi";
import { FileText, HelpCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminHomePage() {
  const { t } = useTranslation();
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["adminPostsOverview", "PENDING"],
    queryFn: () => getAdminPosts("PENDING"),
  });

  const { data: questionsData, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["adminQuestionsOverview", "PENDING"],
    queryFn: () => getAdminQuestions("PENDING"),
  });

  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ["adminReportsOverview", "PENDING"],
    queryFn: () => getAdminReports("PENDING"),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t("admin.overview")}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="posts" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-primary transition-colors flex flex-col justify-between h-36 group">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t("admin.pendingPosts")}</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {isLoadingPosts ? "..." : (postsData?.posts?.length || 0)}
            {postsData?.hasMore && "+"}
          </div>
        </Link>

        <Link to="questions" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-primary transition-colors flex flex-col justify-between h-36 group">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t("admin.pendingQuestions")}</span>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {isLoadingQuestions ? "..." : (questionsData?.questions?.length || 0)}
            {questionsData?.hasMore && "+"}
          </div>
        </Link>

        <Link to="reports" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-primary transition-colors flex flex-col justify-between h-36 group">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t("admin.openReports")}</span>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {isLoadingReports ? "..." : (reportsData?.reports?.length || 0)}
            {reportsData?.hasMore && "+"}
          </div>
        </Link>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-900 mb-1">{t("admin.welcomeTitle")}</h3>
          <p className="text-blue-700 text-sm">{t("admin.welcomeDesc")}</p>
        </div>
      </div>
    </div>
  );
}
