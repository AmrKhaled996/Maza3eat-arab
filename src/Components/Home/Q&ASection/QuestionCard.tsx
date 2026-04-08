import { Badge, Tag } from "../../shared/Tag";
import type { Question } from "../../../Types/Question";
import { ContactButton } from "../../shared/ContactButton";
import type { Tag as TagType } from "../../../Types/Tag";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Heart,
  Reply,
} from "lucide-react";
import ThreeDotsOptionIcon from "../../../assets/images/icons/ThreeDotsOptionIcon";
import PostsComments from "../../../assets/images/icons/PostComments";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";

export function QuestionCard({ question }: { question: Question }) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang } = useLocale();
  const answerCount = question?.answersCount ?? 0;

  return (
    <div
      onClick={() => navigate(localizedPath(lang, `q&a/${question.id}`))}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300 overflow-hidden pb-2 hover:cursor-pointer"
    >
      <div className="p-5">
        {/* Author row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <img
            src={question?.author?.avatar}
            alt={question?.author?.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow outline-2"
            style={{ outlineColor: question?.author?.badgeColor }}
          />
          <span className="text-sm font-bold text-gray-800">
            {question?.author?.name}
          </span>
          <Badge
            color={question?.author?.badgeColor}
            tier={question?.author?.tierName}
          />
          <ContactButton />
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
            {question?.publishDate}
          </span>
        </div>

        {/* Question */}
        <h3 className="text-base font-extrabold text-gray-900 mb-2 leading-snug">
          {question?.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3">
          {question?.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-3">
          {question?.tags.map((t: TagType) => (
            <Tag key={t.name} label={t.name} />
          ))}
        </div>

        {/* Likes / answers */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <button className={`flex items-center gap-1.5 transition-colors `}>
            <Heart size={16} fill="red" color="red" />
            <span className="font-medium">{question?.likesCount}</span>
          </button>
          <span className="flex items-center gap-1.5">
            <span>
              <PostsComments color="#4B5563" />
            </span>
            <span className="font-medium">
              {t("home.answerCount", { count: answerCount })}
            </span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mx-5" />

      {/* Answers section */}
      <div className="px-5 py-3">
        <p className="text-xs font-bold text-gray-700 mb-3">
          {t("home.answersHeading", { count: answerCount })}
        </p>

        <div
          key={question?.topAnswer?.id}
          className="rounded-l-xl p-3 mb-2 bg-[#effff4] relative before:content-[''] before:block before:absolute  before:top-0 before:right-0 before:w-0.75 before:rounded-r-xl before:h-full before:bg-[#22C55E] "
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <img
              src={question?.topAnswer?.author?.avatar}
              alt={question?.topAnswer?.author?.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white outline-2"
              style={{
                outlineColor: question.topAnswer?.author?.tier?.badgeColor,
              }}
            />
            <span className="text-xs font-bold text-gray-800">
              {question?.topAnswer?.author?.name}
            </span>

            <Badge
              color={question?.topAnswer?.author?.tier?.badgeColor as string}
              tier={question?.topAnswer?.author?.tier?.name as string}
            />
            <ContactButton />

            <span className="text-[11px] font-bold bg-[#22C55E] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-4 h-4" /> {t("home.bestAnswer")}
            </span>

            <div className="ml-auto flex items-center gap-1.5 text-xs font-bold">
              <button className="flex gap-1 text-[#22C55E]">
                <ArrowUp className="h-4 w-4 text-gray-400" />
                {question?.topAnswer?.totalVoteValue}
              </button>
              <button className="text-gray-400">
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">
            {question?.topAnswer?.content}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <button className="font-semibold text-primary mr-2 underline transition-colors flex gap-1">
              {t("home.reply")}
              <Reply className="h-4 w-4" />
            </button>
            <button className="hover:text-gray-600 transition-colors flex text-primary hover:cursor-pointer hover:opacity-80">
              <ThreeDotsOptionIcon />
            </button>
          </div>
        </div>

        <button className="text-sm font-semibold mt-1 hover:opacity-75 transition-opacity flex items-end gap-2 text-primary">
          <ArrowRight className="w-4 h-4" />{" "}
          {t("home.viewAnswers", { count: answerCount })}
        </button>
      </div>
    </div>
  );
}
