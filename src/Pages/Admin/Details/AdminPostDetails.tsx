import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminPostById, updatePostStatus } from "../../../Apis/AdminApi";
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../../Components/shared/ConfirmModal";
import { safeFormatDate } from "../../../utils/DateFormater";

export default function AdminPostDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState(false);
  const [promptModal, setPromptModal] = useState(false);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["adminPost", id],
    queryFn: () => getAdminPostById(id!),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => updatePostStatus(id!, "APPROVED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      queryClient.invalidateQueries({ queryKey: ["adminPost", id] });
      setConfirmModal(false);
      navigate("/admin/posts");
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to approve post"),
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => updatePostStatus(id!, "REJECTED", reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      queryClient.invalidateQueries({ queryKey: ["adminPost", id] });
      setPromptModal(false);
      navigate("/admin/posts");
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to reject post"),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>;
  if (isError || !post) return <div className="p-8 text-center text-red-500">{t("admin.postNotFound", "Post not found")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/posts" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">{t("admin.postDetails", "Post Details")}</h2>
        </div>
        
        {post.status === "PENDING" && (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={post.author?.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                <div>
                  <div className="font-semibold text-gray-900">{post.author?.name}</div>
                  <div className="text-xs text-gray-500">{safeFormatDate(post.createdAt, true)}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                post.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                post.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {post.status}
              </span>
            </div>

            <div className="prose max-w-none text-gray-800">
              {post.content}
            </div>

            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {post.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="" className="rounded-lg w-full h-48 object-cover border border-gray-200" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
             <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
               <FileText className="w-5 h-5 text-gray-400" /> {t("admin.metadata", "Metadata")}
             </h4>
             <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4" /> {t("admin.updatedAt", "Updated")}</span>
                 <span className="font-medium text-gray-900">{safeFormatDate(post.updatedAt)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {t("admin.comments", "Comments")}</span>
                 <span className="font-medium text-gray-900">{post._count?.comments || 0}</span>
               </div>
             </div>
          </div>
          
          {post.status === "REJECTED" && post.rejectionReason && (
            <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
              <h4 className="font-semibold text-red-900 mb-2">{t("admin.rejectionReason", "Rejection Reason")}</h4>
              <p className="text-sm text-red-700">{post.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal}
        title={t("admin.approveConfirmTitle", "Approve Post")}
        message={t("admin.approveConfirmMsg", "Are you sure you want to approve this post? It will become visible to all users.")}
        type="info"
        onConfirm={() => approveMutation.mutate()}
        onCancel={() => setConfirmModal(false)}
      />

      <PromptModal
        isOpen={promptModal}
        title={t("admin.rejectReasonTitle", "Reject Post")}
        message={t("admin.rejectReasonMsg", "Please provide a reason for rejecting this post.")}
        placeholder={t("admin.enterReason", "Enter reason...")}
        confirmText={t("admin.reject", "Reject")}
        onConfirm={(reason) => rejectMutation.mutate(reason)}
        onCancel={() => setPromptModal(false)}
      />
    </div>
  );
}
