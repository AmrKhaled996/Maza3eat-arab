import React, { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminAnnouncements, createAdminAnnouncement } from "../../Apis/AdminApi";
import { Megaphone, Plus, Calendar, Type } from "lucide-react";
import { useTranslation } from "react-i18next";
import { safeFormatDate } from "../../utils/DateFormater";

export default function AdminAnnouncementsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{ title: string; content: string; type: "OFFICIAL" | "URGENT" | "INFO" }>({
    title: "",
    content: "",
    type: "INFO",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["adminAnnouncements"],
    queryFn: ({ pageParam }) => getAdminAnnouncements(pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  const createMutation = useMutation({
    mutationFn: () => createAdminAnnouncement(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      setShowForm(false);
      setFormData({ title: "", content: "", type: "INFO" });
    },
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to create announcement"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.title", "Title")}</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.type", "Type")}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value="INFO">{t("admin.typeInfo", "Information")}</option>
                <option value="OFFICIAL">{t("admin.typeOfficial", "Official")}</option>
                <option value="URGENT">{t("admin.typeUrgent", "Urgent")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.content", "Content")}</label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  <th className="px-6 py-4 text-start">{t("admin.title")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.type")}</th>
                  <th className="px-6 py-4 text-start">{t("admin.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.pages.map((page, i) =>
                  page.announcements?.map((item: any) => (
                    <tr key={`${i}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Megaphone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 line-clamp-1 max-w-md">{item.title || item.message}</div>
                            {item.title && item.content && (
                              <div className="text-sm text-gray-500 line-clamp-1 max-w-md">{item.content}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Type className="w-3 h-3" />
                          {t("admin.typeOfficial", "Official")}
                        </span>
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
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
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
    </div>
  );
}
