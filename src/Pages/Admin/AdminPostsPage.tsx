import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminPosts, updatePostStatus, deletePost, createAdminPost } from "../../Apis/AdminApi";
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import PromptModal from "../../Components/shared/PromptModal";

export default function AdminPostsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useLocale();
  const [statusTab, setStatusTab] = useState<"PENDING" | "APPROVED">("PENDING");
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "approve" | "delete"; postId: string | null }>({ isOpen: false, type: "approve", postId: null });
  const [promptModal, setPromptModal] = useState<{ isOpen: boolean; postId: string | null }>({ isOpen: false, postId: null });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminPosts", statusTab],
    queryFn: ({ pageParam }) => getAdminPosts(statusTab, pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ postId, status, reason }: { postId: string; status: "APPROVED" | "REJECTED"; reason?: string }) => 
      updatePostStatus(postId, status, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminPosts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminPosts"] }),
  });

  const handleApprove = (postId: string) => {
    setConfirmModal({ isOpen: true, type: "approve", postId });
  };

  const handleReject = (postId: string) => {
    setPromptModal({ isOpen: true, postId });
  };

  const handleDelete = (postId: string) => {
    setConfirmModal({ isOpen: true, type: "delete", postId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.postsManagement")}</h2>
        <button
          onClick={() => navigate(localizedPath(lang, "admin/posts/create"))}
          className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          + {t("admin.createPost", "Create Post")}
        </button>
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
                  <th className="px-6 py-4 text-start">{t("admin.postDetails")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.author")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.date")}</th>
                  <th className="px-6 py-4 text-end">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.pages.map((page, i) =>
                  page.posts.map((post: any) => (
                    <tr key={`${i}-${post.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 max-w-md truncate">{post.title}</div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <Link to={`/admin/posts/${post.id}`} className="text-primary hover:underline inline-flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {t("admin.view")}
                          </Link>
                          <span>•</span>
                          <span>{post.commentsCount} {t("admin.comments")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {statusTab !== "APPROVED" && (
                            <button
                              onClick={() => handleApprove(post.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleReject(post.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
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
                {data?.pages[0]?.posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noPosts")}
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
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false, postId: null })}
        onConfirm={() => {
          if (confirmModal.postId) {
            if (confirmModal.type === "approve") {
              updateStatusMutation.mutate({ postId: confirmModal.postId, status: "APPROVED" });
            } else {
              deleteMutation.mutate(confirmModal.postId);
            }
          }
        }}
      />

      <PromptModal
        isOpen={promptModal.isOpen}
        title={t("admin.rejectReasonTitle", "Reject Post")}
        message={t("admin.rejectReasonMsg", "Please provide a reason for rejecting this post.")}
        placeholder={t("admin.enterReason", "Enter reason...")}
        confirmText={t("admin.reject", "Reject")}
        onConfirm={(reason) => {
          if (promptModal.postId) {
            updateStatusMutation.mutate({ postId: promptModal.postId, status: "REJECTED", reason });
          }
          setPromptModal({ isOpen: false, postId: null });
        }}
        onCancel={() => setPromptModal({ isOpen: false, postId: null })}
      />
    </div>
  );
}
