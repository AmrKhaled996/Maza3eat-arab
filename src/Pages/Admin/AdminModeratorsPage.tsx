import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getModerators, promoteToModerator, demoteModerator } from "../../Apis/AdminApi";
import { ShieldCheck, ArrowUpRight, ArrowDownRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import Avatar from "../../Components/shared/Avatar";

export default function AdminModeratorsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [promoteUserId, setPromoteUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "promote" | "demote"; userId: string | null }>({
    isOpen: false,
    type: "promote",
    userId: null,
  });

  const [resultModal, setResultModal] = useState<{ isOpen: boolean; type: "success" | "error"; title: string; message: string }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const extractUserId = (input: string) => {
    if (!input) return "";
    const match = input.match(/profile\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminModerators"],
    queryFn: ({ pageParam }) => getModerators(pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });

  const promoteMutation = useMutation({
    mutationFn: (userId: string) => promoteToModerator(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModerators"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setPromoteUserId("");
      setConfirmModal({ isOpen: false, type: "promote", userId: null });
      setResultModal({
        isOpen: true,
        type: "success",
        title: t("admin.success", "Success"),
        message: t("admin.promoteSuccess", "User promoted to moderator successfully!"),
      });
    },
    onError: (err: any) => {
      setResultModal({
        isOpen: true,
        type: "error",
        title: t("admin.error", "Error"),
        message: err?.response?.data?.message || t("admin.promoteFailed", "Failed to promote user."),
      });
    },
  });

  const demoteMutation = useMutation({
    mutationFn: (userId: string) => demoteModerator(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminModerators"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setConfirmModal({ isOpen: false, type: "demote", userId: null });
      setResultModal({
        isOpen: true,
        type: "success",
        title: t("admin.success", "Success"),
        message: t("admin.demoteSuccess", "Moderator demoted successfully!"),
      });
    },
    onError: (err: any) => {
      setResultModal({
        isOpen: true,
        type: "error",
        title: t("admin.error", "Error"),
        message: err?.response?.data?.message || t("admin.demoteFailed", "Failed to demote moderator."),
      });
    },
  });

  const moderatorsList = data?.pages.flatMap((page) => page.moderators) || [];

  const filteredModerators = moderatorsList.filter((user: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("admin.moderatorsManagement", "Moderators Management")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("admin.moderatorsDesc", "Promote users to moderators or demote existing moderators.")}</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("admin.searchModerators", "Search moderators...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      {/* Promote User by ID Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("admin.promoteUserTitle", "Promote User to Moderator by ID")}</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder={t("admin.enterUserIdToPromote", "Enter User ID to promote...")}
            value={promoteUserId}
            onChange={(e) => setPromoteUserId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm flex-1 w-full sm:w-auto"
          />
          <button
            onClick={() => {
              const targetId = extractUserId(promoteUserId);
              if (!targetId) {
                setResultModal({
                  isOpen: true,
                  type: "error",
                  title: t("admin.error", "Error"),
                  message: t("admin.userIdRequired", "Please enter a valid User ID or Profile Link"),
                });
                return;
              }
              setConfirmModal({ isOpen: true, type: "promote", userId: targetId });
            }}
            disabled={promoteMutation.isPending}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowUpRight className="w-4 h-4" />
            {t("admin.promote", "Promote to Moderator")}
          </button>
        </div>
      </div>

      {/* Moderators List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{t("admin.moderator", "Moderator")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.role", "Role")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.joined", "Joined")}</th>
                  <th className="px-6 py-4 text-end">{t("admin.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredModerators.map((user: any, i: number) => (
                  <tr key={`${i}-${user.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <ShieldCheck className="w-3.5 h-3.5" /> MODERATOR
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("admin.unknown", "N/A")}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, type: "demote", userId: user.id })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <ArrowDownRight className="w-4 h-4" /> {t("admin.demote", "Demote to User")}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredModerators.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noModerators", "No moderators found.")}
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
        title={confirmModal.type === "promote" ? t("admin.promoteTitle", "Promote to Moderator") : t("admin.demoteTitle", "Demote Moderator")}
        message={
          confirmModal.type === "promote"
            ? t("admin.promoteConfirm", "Are you sure you want to promote this user to Moderator?")
            : t("admin.demoteConfirm", "Are you sure you want to demote this moderator to a regular User?")
        }
        type={confirmModal.type === "promote" ? "info" : "danger"}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false, userId: null })}
        onConfirm={() => {
          if (confirmModal.userId) {
            if (confirmModal.type === "promote") {
              promoteMutation.mutate(confirmModal.userId);
            } else {
              demoteMutation.mutate(confirmModal.userId);
            }
          }
        }}
      />

      <ConfirmModal
        isOpen={resultModal.isOpen}
        title={resultModal.title}
        message={resultModal.message}
        type={resultModal.type === "success" ? "info" : "danger"}
        onCancel={() => setResultModal({ ...resultModal, isOpen: false })}
        onConfirm={() => setResultModal({ ...resultModal, isOpen: false })}
      />
    </div>
  );
}
