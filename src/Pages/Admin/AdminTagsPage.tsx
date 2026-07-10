import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../Apis/axiosInstance";
import { Tags as TagsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminTagsPage() {
  const { t } = useTranslation();
  const { data: trendingTags, isLoading } = useQuery({
    queryKey: ["trendingTags"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/tags/trending`);
      return data.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.trendingTags")}</h2>
      </div>
      <p className="text-sm text-gray-500">{t("admin.tagsDesc")}</p>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {trendingTags?.map((tag: any, i: number) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
              <TagsIcon className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-700">{tag.normalizedName}</span>
              <span className="mx-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {tag._count.posts + tag._count.questions} {t("admin.uses")}
              </span>
            </div>
          ))}
          {trendingTags?.length === 0 && (
            <div className="text-gray-500 w-full text-center py-8">{t("admin.noTags")}</div>
          )}
        </div>
      )}
    </div>
  );
}
