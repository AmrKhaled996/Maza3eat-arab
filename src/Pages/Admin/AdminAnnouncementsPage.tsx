import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminAnnouncements, createAdminAnnouncement } from "../../Apis/AdminApi";
import { Megaphone, Plus, Calendar, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { safeFormatDate } from "../../utils/DateFormater";

export default function AdminAnnouncementsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [detailAnnouncement, setDetailAnnouncement] = useState<any>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminAnnouncements"],
    queryFn: ({ pageParam }) => getAdminAnnouncements(pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const createMutation = useMutation({
    mutationFn: () => createAdminAnnouncement(message.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      setShowForm(false);
      setMessage("");
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to create announcement"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.announcements", "Announcements")}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          {showForm ? t("admin.cancel", "Cancel") : <><Plus className="w-5 h-5" /> {t("admin.createAnnouncement", "Create Announcement")}</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.content", "Message")}</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("admin.announcementPlaceholder", "Write your announcement message...")}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? t("admin.saving", "Saving...") : t("admin.publish", "Publish")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{t("admin.content", "Message")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.pages.map((page, i) =>
                  page.announcements?.map((item: any) => (
                    <tr
                      key={`${i}-${item.id}`}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setDetailAnnouncement(item)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Megaphone className="w-5 h-5" />
                          </div>
                          <div className="font-semibold text-gray-900 line-clamp-1 max-w-md">
                            {item.message || item.title || item.content}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {safeFormatDate(item.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {(!data?.pages[0]?.announcements || data.pages[0].announcements.length === 0) && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                      {t("admin.noAnnouncements", "No announcements found.")}
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

      {/* Announcement Detail Modal */}
      {detailAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {t("admin.announcementDetail", "Announcement")}
                </h3>
              </div>
              <button
                onClick={() => setDetailAnnouncement(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {detailAnnouncement.message || detailAnnouncement.content || detailAnnouncement.title}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {safeFormatDate(detailAnnouncement.createdAt)}
              </div>
              <button
                onClick={() => setDetailAnnouncement(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                {t("admin.close", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
