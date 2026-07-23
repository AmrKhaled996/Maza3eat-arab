import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminReportById, updateReportStatus } from "../../../Apis/AdminApi";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText, Link as LinkIcon, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { safeFormatDate } from "../../../utils/DateFormater";

export default function AdminReportDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [resolveModal, setResolveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ["adminReport", id],
    queryFn: () => getAdminReportById(id!),
    enabled: !!id,
  });

  const actionMutation = useMutation({
    mutationFn: (status: "RESOLVED" | "REJECTED") => updateReportStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      queryClient.invalidateQueries({ queryKey: ["adminReport", id] });
      setResolveModal(false);
      setRejectModal(false);
      navigate("/admin/reports");
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to update report"),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>;
  if (isError || !report) return <div className="p-8 text-center text-red-500">{t("admin.reportNotFound", "Report not found")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/reports" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">{t("admin.reportDetails", "Report Details")}</h2>
        </div>
        
        {report.status === "PENDING" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setResolveModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-xl font-medium transition-colors"
            >
              <CheckCircle className="w-5 h-5" /> {t("admin.resolve")}
            </button>
            <button
              onClick={() => setRejectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium transition-colors"
            >
              <XCircle className="w-5 h-5" /> {t("admin.reject")}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6 space-y-4">
             <div className="flex items-center gap-3 border-b border-red-100 pb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-red-900">{report.reason}</h3>
                   <p className="text-sm text-red-700">{safeFormatDate(report.createdAt, true)}</p>
                </div>
             </div>

             <div className="pt-2">
                <h4 className="text-sm font-semibold text-red-800 mb-2">{t("admin.reportDescription", "Description provided by reporter:")}</h4>
                <div className="bg-white/60 p-4 rounded-xl text-red-900 border border-red-100 italic">
                  "{report.description || t("admin.noDescription", "No additional description provided.")}"
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
             <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">{t("admin.reportedContent", "Reported Content")}</h4>
             
             {report.type === "POST" && report.post && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                     <FileText className="w-4 h-4" /> Post Content
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-2">{report.post.title}</h5>
                    <p className="text-gray-700">{report.post.content}</p>
                  </div>
                  <Link to={`/admin/posts/${report.postId}`} className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mt-2">
                    <LinkIcon className="w-4 h-4" /> {t("admin.viewFullPost", "View full post")}
                  </Link>
                </div>
             )}

             {report.type === "QUESTION" && report.question && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                     <FileText className="w-4 h-4" /> Question Content
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-2">{report.question.title}</h5>
                    <p className="text-gray-700">{report.question.content}</p>
                  </div>
                  <Link to={`/admin/questions/${report.questionId}`} className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mt-2">
                    <LinkIcon className="w-4 h-4" /> {t("admin.viewFullQuestion", "View full question")}
                  </Link>
                </div>
             )}

             {report.type === "USER" && report.reportedUser && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                     <User className="w-4 h-4" /> Reported User
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <img src={report.reportedUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                     <div>
                       <div className="font-bold text-gray-900">{report.reportedUser.name}</div>
                       <div className="text-sm text-gray-500">{report.reportedUser.email}</div>
                     </div>
                  </div>
                  <Link to={`/admin/users/${report.reportedUserId}`} className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mt-2">
                    <LinkIcon className="w-4 h-4" /> {t("admin.viewUserProfile", "View user profile")}
                  </Link>
                </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
             <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">{t("admin.reporterInfo", "Reporter")}</h4>
             <div className="flex items-center gap-3 pt-2">
               <img src={report.reporter?.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
               <div>
                 <div className="font-medium text-gray-900">{report.reporter?.name}</div>
                 <div className="text-xs text-gray-500">{report.reporter?.email}</div>
               </div>
             </div>
             <Link to={`/admin/users/${report.reporterId}`} className="mt-2 block w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition-colors">
               {t("admin.viewReporterProfile", "View Reporter Profile")}
             </Link>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={resolveModal}
        title={t("admin.resolveReportTitle", "Resolve Report")}
        message={t("admin.resolveReportMsg", "Are you sure you want to resolve this report? It will be removed from the pending list.")}
        type="danger"
        onConfirm={() => actionMutation.mutate("RESOLVED")}
        onCancel={() => setResolveModal(false)}
      />

      <ConfirmModal
        isOpen={rejectModal}
        title={t("admin.rejectReportTitle", "Reject Report")}
        message={t("admin.rejectReportMsg", "Are you sure you want to dismiss this report? It will be removed from the pending list.")}
        type="info"
        onConfirm={() => actionMutation.mutate("REJECTED")}
        onCancel={() => setRejectModal(false)}
      />
    </div>
  );
}
