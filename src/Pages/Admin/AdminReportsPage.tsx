import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminReports, updateReportStatus } from "../../Apis/AdminApi";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ConfirmModal from "../../Components/shared/ConfirmModal";

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "resolve" | "reject"; reportId: string | null }>({ isOpen: false, type: "resolve", reportId: null });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminReports"],
    queryFn: ({ pageParam }) => getAdminReports("PENDING", pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: "RESOLVED" | "REJECTED" }) => 
      updateReportStatus(reportId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminReports"] }),
  });

  const handleResolve = (reportId: string) => {
    setConfirmModal({ isOpen: true, type: "resolve", reportId });
  };

  const handleReject = (reportId: string) => {
    setConfirmModal({ isOpen: true, type: "reject", reportId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.reportsManagement")}</h2>
      </div>



      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{t("admin.reporter")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.targetType")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.reason")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.date")}</th>
                  <th className="px-6 py-4 text-end">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.pages.map((page, i) =>
                  page.reports.map((report: any) => (
                    <tr key={`${i}-${report.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={report.reporter.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium text-gray-700">{report.reporter.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {report.targetType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-sm truncate">
                        {report.reason}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/reports/${report.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Eye className="w-4 h-4" /> {t("admin.view")}
                          </Link>
                          <button
                            onClick={() => handleResolve(report.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Resolve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(report.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {data?.pages[0]?.reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noReports")}
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === "resolve" ? t("admin.resolve") : t("admin.reject")}
        message={confirmModal.type === "resolve" ? t("admin.resolveConfirm") : t("admin.rejectConfirm")}
        type={confirmModal.type === "resolve" ? "info" : "danger"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false, reportId: null })}
        onConfirm={() => {
          if (confirmModal.reportId) {
            updateStatusMutation.mutate({ 
              reportId: confirmModal.reportId, 
              status: confirmModal.type === "resolve" ? "RESOLVED" : "REJECTED" 
            });
          }
        }}
      />
    </div>
  );
}
