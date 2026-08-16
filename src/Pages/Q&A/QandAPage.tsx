import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Loader,
} from "lucide-react";
import NavigationBar from "../../Components/shared/NavigationBar";
import { ContactButton } from "../../Components/shared/ContactButton";
import Advertisement from "../../Components/shared/Advertisement";
import PopularQuestion from "../../Components/shared/PopularQuestion";
import { useTranslation } from "react-i18next";
import { useQuestionDetail } from "../../Hooks/Q&AHooks/useQuestionDetail";
import { useAnswers } from "../../Hooks/Q&AHooks/useAnswers";
import { FormatPublishDate } from "../../utils/DateFormater";
import useContentAds from "../../Hooks/AdvertisementHooks/useContentAdvertisement";
import type { Advertisement as ContentAdvertisement } from "../../Types/Advertisement";
import AnswersSection from "../../Components/Answers/MainContainer";
import { Title } from "react-head";
import { playLikeSound } from "../../utils/sounds";
import { Tag } from "../../Components/shared/Tag";

export default function QandAPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
    const {data:contentAdvertisement} = useContentAds()  as { data?: ContentAdvertisement };

  const {
    data: question,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    like,
    unlike,
  } = useQuestionDetail(id || "");

  const {
    data: answers,
    isLoading: isAnswersLoading,
  } = useAnswers(id || "");

  const [answersSortOrder, setAnswersSortOrder] = useState("votes");

  const handleLikeToggle = () => {
    if (!question) return;
    if (question.likedByMe) {
      unlike();
    } else {
      playLikeSound();
      like();
    }
  };

  if (isQuestionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isQuestionError || !question) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pb-16">
        <NavigationBar page="q&a" solidNav />
        <div className="max-w-4xl mx-auto px-4 pt-28">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-xs">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Question Not Found</h1>
            <p className="text-gray-600">The question you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <NavigationBar page="q&a" solidNav />
      <Title>{question?.title||"question"}</Title>

      {/* Main Page Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 pt-28 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column (Left/Center) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Question Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
              {/* Question Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={question.author.avatar || "/default-avatar.png"}
                    alt={question.author.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{question.author.name}</span>
                      {question.author.tierName && (
                        <span
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase"
                          style={{ backgroundColor: question.author.badgeColor || "#CBD5E1" }}
                        >
                          {question.author.tierName}
                        </span>
                      )}
                      <ContactButton receiverId={question.author.id} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {FormatPublishDate(question.publishDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Title & Description */}
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-950 leading-tight">
                  {question.title}
                </h1>
                <div
                  className="text-gray-700 text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: question.content }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {question.tags.map((tag: any) => (
                  <Tag
                  label={`#${tag.name}`}
                  dir="q&a"
                  key={tag.name}
                  />
                ))}
              </div>

              {/* Question Interactions Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-gray-500">
                <div className="flex items-center gap-6">
                  {/* Like Button */}
                  <button
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer hover:text-red-500 ${
                      question.likedByMe ? "text-red-500" : ""
                    }`}
                  >
                    <Heart size={16} fill={question.likedByMe ? "currentColor" : "none"} />
                    <span>{t("QandAPage.likesLabel", { count: question.likesCount })}</span>
                  </button>

                  {/* Answers count */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <MessageCircle size={16} />
                    <span>{t("QandAPage.answersLabel", { count: question.answersCount })}</span>
                  </div>
                </div>

                {/* Share Button */}
                <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-indigo-600 transition-colors cursor-pointer">
                  <Share2 size={16} />
                  <span>{t("QandAPage.share")}</span>
                </button>
              </div>
            </div>

            {/* Answers Section Header with Sorting */}
            {!isAnswersLoading && answers && answers.length > 0 && (
              <div className="flex items-center justify-between mt-8 mb-2">
                <h2 className="text-base font-bold text-gray-900">
                  {t("QandAPage.answersHeading", { count: answers.length })}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{t("QandAPage.sortBy")}:</span>
                  <select
                    value={answersSortOrder}
                    onChange={(e) => setAnswersSortOrder(e.target.value)}
                    className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs hover:border-gray-300 transition-colors"
                  >
                    <option value="votes">{t("QandAPage.mostLiked")}</option>
                    <option value="newest">{t("QandAPage.newest")}</option>
                    <option value="oldest">{t("QandAPage.oldest")}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Answers List */}
            <div className="space-y-4">
              <div className=" py-4 bg-white rounded-3xl border border-gray-100 -z-20">
              <AnswersSection />
              </div>
            </div>

            {/* Answer Input Box */}

          </div>

          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-4 space-y-6 flex flex-row-reverse lg:flex-col justify-center lg:justify-start gap-6">
            {/* Sponsored Ad */}
            <Advertisement ad={contentAdvertisement} />

            {/* Top 10 Popular Questions */}
            <PopularQuestion limit={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
