import { useState } from "react";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, banUser, unbanUser, updateUserTier, getAdminTiers, getAdminUserById } from "../../Apis/AdminApi";
import { Ban, CheckCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import PromptModal from "../../Components/shared/PromptModal";
import { safeFormatDate } from "../../utils/DateFormater";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const { lang } = useLocale();
  const [statusTab, setStatusTab] = useState<"active" | "banned">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Result popup modal state
  const [resultModal, setResultModal] = useState<{ isOpen: boolean; type: "success" | "error"; title: string; message: string }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [tierUserId, setTierUserId] = useState("");
  const [selectedTierId, setSelectedTierId] = useState<number>(1);

  // Profile URL modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileUrlInput, setProfileUrlInput] = useState("");
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [isSearchingProfile, setIsSearchingProfile] = useState(false);

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

  const extractUserId = (input: string) => {
    if (!input) return "";
    const match = input.match(/profile\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  };

  const banMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) => banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setPromptModal({ isOpen: false, userId: null });
      if (searchedUser) {
        setSearchedUser({ ...searchedUser, isBanned: true, ban: { reason: promptModal.userId } });
      }
      setResultModal({
        isOpen: true,
        type: "success",
        title: t("admin.success", "Success"),
        message: t("admin.userBannedSuccess", "User has been banned successfully!"),
      });
    },
    onError: (error: any) => {
      console.error("Failed to ban user", error);
      setResultModal({
        isOpen: true,
        type: "error",
        title: t("admin.error", "Error"),
        message: error?.response?.data?.message || t("admin.banFailed", "Failed to ban user. Check if reason is at least 3 characters."),
      });
    }
  });

  const unbanMutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      if (searchedUser) {
        setSearchedUser({ ...searchedUser, isBanned: false, ban: null });
      }
      setResultModal({
        isOpen: true,
        type: "success",
        title: t("admin.success", "Success"),
        message: t("admin.userUnbannedSuccess", "User has been unbanned successfully!"),
      });
    },
    onError: (error: any) => {
      setResultModal({
        isOpen: true,
        type: "error",
        title: t("admin.error", "Error"),
        message: error?.response?.data?.message || t("admin.unbanFailed", "Failed to unban user."),
      });
    }
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ userId, tierId }: { userId: string; tierId: number }) => updateUserTier(userId, tierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setTierUserId("");
      setResultModal({
        isOpen: true,
        type: "success",
        title: t("admin.success", "Success"),
        message: t("admin.tierUpdatedSuccess", "User tier updated successfully!"),
      });
    },
    onError: (err: any) => {
      setResultModal({
        isOpen: true,
        type: "error",
        title: t("admin.error", "Error"),
        message: err?.response?.data?.message || t("admin.tierUpdateFailed", "Failed to update tier. Please check the User ID or profile link."),
      });
    }
  });

  const handleBan = (userId: string) => {
    setPromptModal({ isOpen: true, userId });
  };

  const handleUnban = (userId: string) => {
    setConfirmModal({ isOpen: true, type: "unban", userId });
  };

  const handleProfileSearch = async () => {
    setSearchError("");
    setSearchedUser(null);
    if (!profileUrlInput.trim()) return;

    const userId = extractUserId(profileUrlInput);

    try {
      setIsSearchingProfile(true);
      const res = await getAdminUserById(userId);
      setSearchedUser(res);
    } catch (err: any) {
      setSearchError(err?.response?.data?.message || t("admin.userNotFound", "User not found with this profile link or ID."));
    } finally {
      setIsSearchingProfile(false);
    }
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
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> {t("admin.searchProfileModal", "Ban/Unban by Profile Link")}
          </button>

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
      </div>

      {/* Quick Tier Update by User ID or Profile Link Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("admin.updateTierById", "Update User Tier by User ID or Profile Link")}</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder={t("admin.enterUserIdOrLink", "Enter User ID or Profile Link...")}
            value={tierUserId}
            onChange={(e) => setTierUserId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm flex-1 w-full sm:w-auto"
          />
          <select
            value={selectedTierId}
            onChange={(e) => setSelectedTierId(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm w-full sm:w-auto"
          >
            {tiersData?.map((tier: any) => (
              <option key={tier.id} value={tier.id}>{tier.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const targetId = extractUserId(tierUserId);
              if (!targetId) {
                setResultModal({
                  isOpen: true,
                  type: "error",
                  title: t("admin.error", "Error"),
                  message: t("admin.userIdRequired", "Please enter a valid User ID or Profile Link"),
                });
                return;
              }
              updateTierMutation.mutate({ userId: targetId, tierId: selectedTierId });
            }}
            disabled={updateTierMutation.isPending}
            className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {updateTierMutation.isPending ? t("admin.updating", "Updating...") : t("admin.updateTier", "Update Tier")}
          </button>
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
                        <Link to={localizedPath(lang, `profile/${user.id}`)} className="flex items-center gap-3 group hover:text-primary">
                          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-100" />
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${user.tier.badgeColor}20`, color: user.tier.badgeColor }}>
                          {user.tier.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {safeFormatDate(user.createdAt)}
                      </td>
                      {statusTab === "banned" && (
                        <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                          {user.ban?.reason}
                        </td>
                      )}
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={localizedPath(lang, `admin/users/${user.id}`)}
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

      {/* Ban / Unban dedicated Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl text-start">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t("admin.searchBanModalTitle", "Ban / Unban Account by Profile Link")}</h3>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="https://example.com/en/profile/USER_ID"
                value={profileUrlInput}
                onChange={(e) => setProfileUrlInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              />
              <button
                onClick={handleProfileSearch}
                disabled={isSearchingProfile}
                className="px-5 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
              >
                {isSearchingProfile ? t("admin.searching", "Searching...") : t("admin.search", "Search")}
              </button>
            </div>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm mb-4">
                {searchError}
              </div>
            )}

            {searchedUser && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center gap-4">
                  <img src={searchedUser.avatar} alt="" className="w-14 h-14 rounded-full object-cover bg-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-900">{searchedUser.name}</h4>
                    <p className="text-xs text-gray-500">{searchedUser.email}</p>
                    <p className="text-xs font-mono text-gray-400 mt-1">ID: {searchedUser.id}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>
                    <span className="text-xs text-gray-500">{t("admin.status", "Status")}: </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      searchedUser.isBanned === undefined ? "bg-gray-100 text-gray-700" :
                      searchedUser.isBanned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {searchedUser.isBanned === undefined
                        ? (lang === "ar" ? "غير معروف" : "Unknown")
                        : searchedUser.isBanned ? t("admin.banned", "Banned") : t("admin.active", "Active")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {searchedUser.isBanned !== true && (
                      <button
                        onClick={() => handleBan(searchedUser.id)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" /> {t("admin.ban", "Ban")}
                      </button>
                    )}
                    {searchedUser.isBanned !== false && (
                      <button
                        onClick={() => handleUnban(searchedUser.id)}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> {t("admin.unban", "Unban")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  setSearchedUser(null);
                  setProfileUrlInput("");
                  setSearchError("");
                }}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium rounded-xl text-sm transition-colors"
              >
                {t("admin.close", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}

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
              setResultModal({
                isOpen: true,
                type: "error",
                title: t("admin.error", "Error"),
                message: t("admin.banReasonMin", "Reason must be at least 3 characters long."),
              });
              return;
            }
            banMutation.mutate({ userId: promptModal.userId, reason });
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
