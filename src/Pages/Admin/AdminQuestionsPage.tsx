import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminQuestions, updateQuestionStatus, deleteQuestion } from "../../Apis/AdminApi";
import { CheckCircle, Trash2, Eye, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import { safeFormatDate } from "../../utils/DateFormater";

export default function AdminQuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useLocale();
  const [statusTab, setStatusTab] = useState<"PENDING" | "APPROVED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "approve" | "delete"; questionId: string | null }>({ isOpen: false, type: "approve", questionId: null });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminQuestions", statusTab, searchQuery],
    queryFn: ({ pageParam }) => getAdminQuestions(statusTab, pageParam as string | null,searchQuery),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ questionId, status, reason }: { questionId: string; status: "APPROVED" | "REJECTED"; reason?: string }) => 
      updateQuestionStatus(questionId, status, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminQuestions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminQuestions"] }),
  });

  const handleApprove = (questionId: string) => {
    setConfirmModal({ isOpen: true, type: "approve", questionId });
  };

  const handleDelete = (questionId: string) => {
    setConfirmModal({ isOpen: true, type: "delete", questionId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.questionsManagement")}</h2>
         <div className="flex items-center gap-3">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("admin.searchPosts", "Search posts...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm w-full sm:w-64"
            />
          </div>
        <button
          onClick={() => navigate(localizedPath(lang, "admin/questions/create"))}
          className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          + {t("admin.createQuestion", "Create Question")}
        </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        {(["PENDING", "APPROVED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              statusTab === tab ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t(`admin.${tab.toLowerCase()}`)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{t("admin.questionDetails")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.author")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.date")}</th>
                  <th className="px-6 py-4 text-end">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.pages.map((page, i) =>
                  page.questions.map((question: any) => (
                    <tr key={`${i}-${question.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 max-w-md truncate">{question.title}</div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <Link to={localizedPath(lang, `admin/questions/${question.id}`)} className="text-primary hover:underline inline-flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {t("admin.view")}
                          </Link>
                          <span>•</span>
                          <span>{question.answersCount} {t("admin.answers")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={localizedPath(lang, `profile/${question.author.id}`)} className="flex items-center gap-2 group hover:text-primary">
                          <img src={question.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{question.author.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {safeFormatDate(question.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {statusTab !== "APPROVED" && (
                            <button
                              onClick={() => handleApprove(question.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(question.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {data?.pages[0]?.questions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noQuestions")}
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
        title={confirmModal.type === "approve" ? t("admin.approve") : t("admin.delete")}
        message={confirmModal.type === "approve" ? t("admin.approveConfirm") : t("admin.deleteConfirm")}
        type={confirmModal.type === "approve" ? "info" : "danger"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false, questionId: null })}
        onConfirm={() => {
          if (confirmModal.questionId) {
            if (confirmModal.type === "approve") {
              updateStatusMutation.mutate({ questionId: confirmModal.questionId, status: "APPROVED" });
            } else {
              deleteMutation.mutate(confirmModal.questionId);
            }
          }
        }}
      />
    </div>
  );
}
