import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../Apis/axiosInstance";
import { Tags as TagsIcon, FileText, HelpCircle, Search, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminTagsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allTags, isLoading } = useQuery({
    queryKey: ["adminAllTags"],
    queryFn: async () => {
      // Fetch tags with detailed usage counts from backend
      const { data } = await axiosInstance.get(`/tags/trending`);
      return data.data;
    }
  });

  const filteredTags = allTags?.filter((tag: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return tag.name?.toLowerCase().includes(q) || tag.normalizedName?.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t("admin.trendingTags", "Popular & Trending Tags")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("admin.tagsDesc", "Tag analytics across all posts and community questions.")}</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("admin.searchTags", "Search tags...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags.map((tag: any, i: number) => {
            const postsCount = tag._count?.posts ?? tag.postsCount ?? 0;
            const questionsCount = tag._count?.questions ?? 0;
            const totalUsage = postsCount + questionsCount;

            return (
              <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <TagsIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900">{tag.name || tag.normalizedName}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    <TrendingUp className="w-3 h-3" /> #{i + 1}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>{postsCount} {t("admin.posts", "Posts")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>{questionsCount} {t("admin.questions", "Questions")}</span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-xs text-gray-400 font-medium">
                    {t("admin.totalUses", "Total Uses")}: <strong className="text-gray-700">{totalUsage}</strong>
                  </span>
                </div>
              </div>
            );
          })}

          {filteredTags.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
              {t("admin.noTags", "No tags found")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
