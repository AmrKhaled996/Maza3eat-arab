import { useQuery } from "@tanstack/react-query";
import { getTrendingTags, type TagItem } from "../../Apis/TagsApi";
import { TrendingUp, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

export default function TrendingTags({ limit = 10 }: { limit?: number }) {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const navigate = useNavigate();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["trendingTags", limit],
    queryFn: () => getTrendingTags(limit),
    staleTime: 60_000,
  });

  const handleTagClick = (tagName: string) => {
    navigate(`${localizedPath(lang, "community")}?search=%23${encodeURIComponent(tagName)}`);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4 sticky top-28">
      <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-3">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-sm">{t("community.trendingTags", "Trending Tags")}</span>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-16 bg-gray-100 rounded-full" />
          ))}
        </div>
      ) : tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: TagItem) => (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-primary/10 hover:text-primary border border-gray-200/80 rounded-full px-3 py-1.5 transition-all duration-200 cursor-pointer"
            >
              <Hash className="w-3 h-3 text-primary/70" />
              <span>{tag.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">{t("community.noTags", "No trending tags yet.")}</p>
      )}
    </div>
  );
}
