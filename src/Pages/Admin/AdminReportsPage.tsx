import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminReportById, getAdminReports, updateReportStatus } from "../../Apis/AdminApi";
import { Trash2, Eye, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import { safeFormatDate } from "../../utils/DateFormater";
import { localizedPath } from "../../i18n/paths";
import { useLocale } from "../../i18n/useLocale";
import Avatar from "../../Components/shared/Avatar";
import type { Report } from "../../Types/Report";

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const { lang } = useLocale();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; reportId: string | null }>({ isOpen: false, reportId: null });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; report: any | null }>({ isOpen: false, report: null });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminReports"],
    queryFn: ({ pageParam }) => getAdminReports("PENDING", pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: (reportId: string) => updateReportStatus(reportId, "REJECTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReports"] });
      setDeleteModal({ isOpen: false, reportId: null });
    },
  });

  const handleDelete = (reportId: string) => {
    setDeleteModal({ isOpen: true, reportId });
  };

  const formatTargetType = (type: string) => {
    if (lang === "ar") {
      switch (type) {
        case "POST": return "منشور";
        case "QUESTION": return "سؤال";
        case "COMMENT": return "تعليق";
        case "ANSWER": return "إجابة";
        case "COMMENT_REPLY": return "رد على تعليق";
        case "ANSWER_REPLY": return "رد على إجابة";
        case "COMMENT_REPLY_REPLY": return "رد فرعي";
        case "CONTACT_REQUEST": return "طلب تواصل";
        default: return type;
      }
    } else {
      switch (type) {
        case "POST": return "Post";
        case "QUESTION": return "Question";
        case "COMMENT": return "Comment";
        case "ANSWER": return "Answer";
        case "COMMENT_REPLY": return "Comment Reply";
        case "ANSWER_REPLY": return "Answer Reply";
        case "COMMENT_REPLY_REPLY": return "Nested Reply";
        case "CONTACT_REQUEST": return "Contact Request";
        default: return type;
      }
    }
  };

  const handleReportClick = async (report:Report) => {

  
  
    await getAdminReportById(report?.id).then((res:any) => {
      console.log("response",res)
  
        switch (res?.targetType) {
            case "ANSWER":
  
              return (
                navigate(localizedPath(lang, `q&a/${res?.questionId}?highlighted=${res?.answer?.id}#${res?.answer?.id}`),{state:{answer: res?.answer}})
              );
            case "COMMENT":
              return (
                navigate(localizedPath(lang, `post/${res?.postId}?highlighted=${res?.comment?.id}#${res?.comment?.id}`),{state:{comment: res?.comment}})
              );
            case "COMMENT_REPLY":
              return (
                navigate(localizedPath(lang, `post/${res?.postId}?highlighted=${res?.reply?.id}#${res?.reply?.id}`),{state:{reply: res?.reply,commentId: res?.comment?.id}})
              );
              case "ANSWER_REPLY":
              return (
                navigate(localizedPath(lang, `q&a/${res?.questionId}?highlighted=${res?.reply?.id}#${res?.reply?.id}`),{state:{reply: res?.reply,answerId: res?.answer?.id}})
              );
              case "COMMENT_REPLY_REPLY":
                return (
                  navigate(localizedPath(lang, `replies`),{state:{reply: res?.parentReply}})
                );
            case "ANSWER_REPLY_REPLY":
              return (
                navigate(localizedPath(lang, `answer-replies`),{state:{reply: res?.parentReply}})
              );
              case "CONTACT_REQUEST":
              return navigate(localizedPath(lang, `admin/reports/${report?.id}`));
            default:
              return navigate(localizedPath(lang, `admin/reports/${report?.id}`));
            }
          })

  
    };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.reportsManagement", "Reports Management")}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{t("admin.reporter", "Reporter")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.targetType", "Target Type")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.reason", "Reason")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.date", "Date")}</th>
                  <th className="px-6 py-4 text-end">{t("admin.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.pages.map((page, i) =>
                  page.reports.map((report: any) => (
                    <tr key={`${i}-${report.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          to={localizedPath(lang, `profile/${report.reporter.id || report.reporterId}`)}
                          className="flex items-center gap-2 group hover:text-primary"
                        >
                          <Avatar src={report.reporter.avatar} name={report.reporter.name} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary group-hover:underline">{report.reporter.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {formatTargetType(report.targetType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <button
                          onClick={() => setDetailModal({ isOpen: true, report })}
                          className="text-start truncate hover:text-primary hover:underline block w-full hover:cursor-pointer  transition-all duration-300"
                          title={t("admin.clickToViewReason", "Click to view full reason")}
                        >
                          {report.reason}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {safeFormatDate(report.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailModal({ isOpen: true, report })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium  hover:cursor-pointer hover:opacity-80 transition-all duration-300"
                          >
                            <Eye className="w-4 h-4" /> {t("admin.view", "View Details")}
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg  hover:cursor-pointer hover:opacity-80 transition-all duration-300 "
                            title={t("admin.deleteReport", "Delete Report")}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {data?.pages[0]?.reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noReports", "No pending reports")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {hasNextPage && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? t("admin.loadingMore") : t("admin.loadMore")}
            </button>
          </div>
        )}
      </div>

      {/* Reason Detail Popup Modal */}
      {detailModal.isOpen && detailModal.report && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl text-start space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t("admin.reportReasonDetails", "Report Reason Details")}</h3>
                <span className="text-xs text-gray-400">{formatTargetType(detailModal.report.targetType)} • {safeFormatDate(detailModal.report.createdAt, true)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">{t("admin.reporter", "Reporter")}</label>
                <Link
                  to={localizedPath(lang, `profile/${detailModal.report.reporter.id || detailModal.report.reporterId}`)}
                  className="flex items-center gap-2 group"
                >
                  <Avatar src={detailModal.report.reporter.avatar} name={detailModal.report.reporter.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-sm font-medium text-gray-800 group-hover:text-primary group-hover:underline">{detailModal.report.reporter.name} ({detailModal.report.reporter.email})</span>
                </Link>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">{t("admin.reason", "Report Reason")}</label>
                <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl text-red-900 text-sm font-medium leading-relaxed">
                  {detailModal.report.reason}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div
                onClick={()=>{handleReportClick(detailModal.report)}}
                className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium hover:cursor-pointer hover:opacity-80 transition-all duration-300"
              >
                <Eye className="w-4 h-4" /> {t("admin.goToFullReport", "Go to Full Report Page")}
              </div>
              
              <button
                onClick={() => setDetailModal({ isOpen: false, report: null })}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:cursor-pointer hover:opacity-80 transition-all duration-300"
              >
                {t("admin.close", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t("admin.deleteReportTitle", "Delete Report")}
        message={t("admin.deleteReportConfirm", "Are you sure you want to delete this report?")}
        type="danger"
        onCancel={() => setDeleteModal({ isOpen: false, reportId: null })}
        onConfirm={() => {
          if (deleteModal.reportId) {
            deleteMutation.mutate(deleteModal.reportId);
          }
        }}
      />
    </div>
  );
}
