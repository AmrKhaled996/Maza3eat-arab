import { Badge, Tag } from "../shared/Tag";
import type { Question } from "../../Types/Question";
import { ContactButton } from "../shared/ContactButton";
import type { Tag as TagType } from "../../Types/Tag";
import {
  Heart,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormatPublishDate } from "../../utils/DateFormater";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import cn from "../../utils/Cn";

function stripHtml(html: string) {
  if (!html) return "";
  let text = html.replace(/<[^>]*>/g, "");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text;
}

export function QuestionCard({ question }: { question: Question }) {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const answerCount = question?.answersCount ?? 0;

  return (
    <div
      onClick={() => navigate(localizedPath(lang, `q&a/${question.id}`))}
      className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden hover:cursor-pointer p-6 space-y-4"
    >
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(localizedPath(lang, `profile/${question.author.id}`));
          }}
          className="flex items-center gap-3 group"
        >
          <img
            src={question?.author?.avatar || "/default-avatar.png"}
            alt={question?.author?.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 ring-2 ring-gray-50 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 group-hover:text-primary transition-colors text-sm">
                {question?.author?.name}
              </span>
              {question?.author?.tierName && (
                <Badge
                  color={question?.author?.badgeColor}
                  tier={question?.author?.tierName}
                />
              )}
              <span onClick={(e) => e.stopPropagation()}>
                <ContactButton receiverId={question.author.id} />
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {question?.publishDate ? FormatPublishDate(question.publishDate) : ""}
            </span>
          </div>
        </div>

        {/* Answer count pill badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-extrabold shadow-2xs">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{answerCount} {lang === "ar" ? "إجابة" : "Answers"}</span>
        </div>
      </div>

      {/* Question Title & Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-950 leading-snug group-hover:text-primary transition-colors">
          {question?.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {stripHtml(question?.content || "")}
        </p>
      </div>

      {/* Tags */}
      {question?.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {question.tags.map((t: TagType) => (
            <Tag key={t.name} label={t.name} />
          ))}
        </div>
      )}

      {/* Footer Interactions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100/80 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 font-semibold text-gray-600 hover:text-red-500 transition-colors">
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span>{question?.likesCount || 0}</span>
          </button>

          <div className="flex items-center gap-1.5 font-semibold text-gray-500">
            <MessageCircle size={16} />
            <span>{t("home.answerCount", { count: answerCount })}</span>
          </div>
        </div>

        <span className="font-bold text-primary hover:underline flex items-center gap-1">
          <span>{lang === "ar" ? "عرض التفاصيل والإجابات" : "View Answers"}</span>
          <ArrowRight className={cn("w-4 h-4", lang === "ar" && "rotate-180")} />
        </span>
      </div>
    </div>
  );
}
