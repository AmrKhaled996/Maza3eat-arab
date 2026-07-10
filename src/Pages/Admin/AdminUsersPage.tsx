import React, { useState } from "react";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, banUser, unbanUser, updateUserTier, getAdminTiers } from "../../Apis/AdminApi";
import { Ban, CheckCircle, ShieldAlert, Edit2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import PromptModal from "../../Components/shared/PromptModal";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [statusTab, setStatusTab] = useState<"active" | "banned">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "unban" | "tier"; userId: string | null; tierId?: number }>({ isOpen: false, type: "unban", userId: null });
  const [promptModal, setPromptModal] = useState<{ isOpen: boolean; userId: string | null }>({ isOpen: false, userId: null });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminUsers", statusTab],
    queryFn: ({ pageParam }) => getAdminUsers(statusTab, pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const { data: tiersData } = useQuery({
    queryKey: ["adminTiers"],
    queryFn: () => getAdminTiers(),
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setPromptModal({ isOpen: false, userId: null });
    },
    onError: (error: any) => {
      console.error("Failed to ban user", error);
      alert(error?.response?.data?.message || "Failed to ban user. Check if reason is at least 3 characters.");
    }
  });

  const unbanMutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ userId, tierId }: { userId: string; tierId: number }) => updateUserTier(userId, tierId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });

  const handleBan = (userId: string) => {
    setPromptModal({ isOpen: true, userId });
  };

  const handleUnban = (userId: string) => {
    setConfirmModal({ isOpen: true, type: "unban", userId });
  };

  const handleUpdateTier = (userId: string, tierId: number) => {
    setConfirmModal({ isOpen: true, type: "tier", userId, tierId });
  };

  const filteredUsers = data?.pages.flatMap(page => page.users).filter(user => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return user.name?.toLowerCase().includes(q) || 
           user.email?.toLowerCase().includes(q) || 
           user.id?.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.users")}</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("admin.searchUsers", "Search users...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none w-full sm:w-64"
          />
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setStatusTab("active")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${statusTab === "active" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {t("admin.activeUsers")}
        </button>
        <button
          onClick={() => setStatusTab("banned")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${statusTab === "banned" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {t("admin.bannedUsers")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{t("admin.user")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.tier")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.joined")}</th>
                  {statusTab === "banned" && <th className="px-6 py-4 text-start">{t("admin.banReason")}</th>}
                  <th className="px-6 py-4 text-end">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user: any, i: number) => (
                    <tr key={`${i}-${user.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${user.tier.badgeColor}20`, color: user.tier.badgeColor }}>
                          {user.tier.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      {statusTab === "banned" && (
                        <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                          {user.ban?.reason}
                        </td>
                      )}
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Search className="w-4 h-4" /> {t("admin.view")}
                          </Link>
                          {statusTab === "active" ? (
                            <button
                              onClick={() => handleBan(user.id)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Ban className="w-4 h-4" /> {t("admin.ban")}
                            </button>
                          ) : (
                            <button
                              onClick={() => unbanMutation.mutate(user.id)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" /> {t("admin.unban")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={statusTab === "banned" ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noUsers")}
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
        title={confirmModal.type === "unban" ? t("admin.unbanUser") : t("admin.changeTier")}
        message={confirmModal.type === "unban" ? t("admin.unbanConfirm") : t("admin.changeTierConfirm")}
        type="info"
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false, userId: null })}
        onConfirm={() => {
          if (confirmModal.userId) {
            if (confirmModal.type === "unban") {
              unbanMutation.mutate(confirmModal.userId);
            } else if (confirmModal.tierId) {
              updateTierMutation.mutate({ userId: confirmModal.userId, tierId: confirmModal.tierId });
            }
          }
        }}
      />

      <PromptModal
        isOpen={promptModal.isOpen}
        title={t("admin.banUser")}
        message={t("admin.enterBanReason")}
        type="danger"
        onCancel={() => setPromptModal({ isOpen: false, userId: null })}
        onConfirm={(reason) => {
          if (promptModal.userId) {
            if (reason.trim().length < 3) {
              alert(t("admin.banReasonMin", "Reason must be at least 3 characters long."));
              return;
            }
            banMutation.mutate({ userId: promptModal.userId, reason });
          }
        }}
      />
    </div>
  );
}
