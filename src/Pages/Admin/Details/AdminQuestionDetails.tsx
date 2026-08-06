import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminQuestionById, updateQuestionStatus } from "../../../Apis/AdminApi";
import { ArrowLeft, CheckCircle, XCircle, Clock, MessageCircle, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../../Components/shared/ConfirmModal";
import PromptModal from "../../../Components/shared/PromptModal";
import { safeFormatDate, FormatPublishDate } from "../../../utils/DateFormater";
import { localizedPath } from "../../../i18n/paths";
import { useLocale } from "../../../i18n/useLocale";

export default function AdminQuestionDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { lang } = useLocale();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState(false);
  const [promptModal, setPromptModal] = useState(false);

  const { data: question, isLoading, isError } = useQuery({
    queryKey: ["adminQuestion", id],
    queryFn: () => getAdminQuestionById(id!),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => updateQuestionStatus(id!, "APPROVED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["adminQuestion", id] });
      setConfirmModal(false);
      navigate(localizedPath(lang, "admin/questions"));
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to approve question"),
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => updateQuestionStatus(id!, "REJECTED", reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["adminQuestion", id] });
      setPromptModal(false);
      navigate(localizedPath(lang, "admin/questions"));
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to reject question"),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>;
  if (isError || !question) return <div className="p-8 text-center text-red-500">{t("admin.questionNotFound", "Question not found")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={localizedPath(lang, "admin/questions")} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">{t("admin.questionDetails", "Question Details")}</h2>
        </div>
        
        {question.status === "PENDING" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-xl font-medium transition-colors"
            >
              <CheckCircle className="w-5 h-5" /> {t("admin.approve")}
            </button>
            <button
              onClick={() => setPromptModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl font-medium transition-colors"
            >
              <XCircle className="w-5 h-5" /> {t("admin.reject")}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column (Left/Center) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
            {/* Question Header */}
            <div className="flex items-start justify-between">
              <Link
                to={localizedPath(lang, `profile/${question.author?.id}`)}
                className="flex items-center gap-3 group"
              >
                <img
                  src={question.author?.avatar || "/default-avatar.png"}
                  alt={question.author?.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 group-hover:text-primary group-hover:underline">{question.author?.name}</span>
                    {question.author?.tierName && (
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase"
                        style={{ backgroundColor: question.author.badgeColor || "#CBD5E1" }}
                      >
                        {question.author.tierName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {question.publishDate ? FormatPublishDate(question.publishDate) : ""}
                  </span>
                </div>
              </Link>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                question.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                question.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {question.status}
              </span>
            </div>

            {/* Question Title & Description */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-950 leading-tight">
                {question.title}
              </h1>
              <div
                className="text-gray-700 text-sm leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: question.content }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {question.tags?.map((tag: any) => (
                <span
                  key={tag.name}
                  className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
             <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
               <FileText className="w-5 h-5 text-gray-400" /> {t("admin.metadata", "Metadata")}
             </h4>
             <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4" /> {t("admin.updatedAt", "Updated")}</span>
                 <span className="font-medium text-gray-900">{safeFormatDate(question.updatedAt)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {t("admin.answers", "Answers")}</span>
                 <span className="font-medium text-gray-900">{question.answersCount ?? 0}</span>
               </div>
             </div>
          </div>
          
          {question.status === "REJECTED" && question.rejectionReason && (
            <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
              <h4 className="font-semibold text-red-900 mb-2">{t("admin.rejectionReason", "Rejection Reason")}</h4>
              <p className="text-sm text-red-700">{question.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal}
        title={t("admin.approveConfirmTitle", "Approve Question")}
        message={t("admin.approveConfirmMsg", "Are you sure you want to approve this question? It will become visible to all users.")}
        type="info"
        onConfirm={() => approveMutation.mutate()}
        onCancel={() => setConfirmModal(false)}
      />

      <PromptModal
        isOpen={promptModal}
        title={t("admin.rejectReasonTitle", "Reject Question")}
        message={t("admin.rejectReasonMsg", "Please provide a reason for rejecting this question.")}
        placeholder={t("admin.enterReason", "Enter reason...")}
        confirmText={t("admin.reject", "Reject")}
        onConfirm={(reason) => rejectMutation.mutate(reason)}
        onCancel={() => setPromptModal(false)}
      />
    </div>
  );
}
