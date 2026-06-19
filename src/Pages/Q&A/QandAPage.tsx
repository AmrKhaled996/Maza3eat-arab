import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
  CornerDownLeft,
  Loader,
  MessageSquare,
} from "lucide-react";
import NavigationBar from "../../Components/shared/NavigationBar";
import { ContactButton } from "../../Components/shared/ContactButton";
import Advertisement from "../../Components/shared/Advertisement";
import PopularQuestion from "../../Components/shared/PopularQuestion";
import { useTranslation } from "react-i18next";
import { useQuestionDetail } from "../../Hooks/Q&AHooks/useQuestionDetail";
import { useAnswers } from "../../Hooks/Q&AHooks/useAnswers";
import { useReplies } from "../../Hooks/Q&AHooks/useReplies";
import { useAuth } from "../../Context/Auth";
import { FormatPublishDate } from "../../utils/DateFormater";

export default function QandAPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation("common");

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
    postAnswer,
    voteAnswer,
    isPosting: isPostingAnswer,
  } = useAnswers(id || "");

  const [answersSortOrder, setAnswersSortOrder] = useState("votes");
  const [newAnswerContent, setNewAnswerContent] = useState("");

  const sortedAnswers = [...(answers || [])].sort((a, b) => {
    if (answersSortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (answersSortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.totalVoteValue - a.totalVoteValue;
  });

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerContent.trim()) return;
    postAnswer(newAnswerContent.trim(), {
      onSuccess: () => setNewAnswerContent(""),
    });
  };

  const handleLikeToggle = () => {
    if (!question) return;
    if (question.likedByMe) {
      unlike();
    } else {
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
                      <ContactButton />
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
                  <span
                    key={tag.name}
                    className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full"
                  >
                    #{tag.name}
                  </span>
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
                    <span>{question.likesCount} {question.likesCount === 1 ? "Like" : "Likes"}</span>
                  </button>

                  {/* Answers count */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <MessageCircle size={16} />
                    <span>{question.answersCount} {question.answersCount === 1 ? "Answer" : "Answers"}</span>
                  </div>
                </div>

                {/* Share Button */}
                <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-indigo-600 transition-colors cursor-pointer">
                  <Share2 size={16} />
                  <span>Share</span>
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
                    className="text-xs font-bold text-gray-750 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs hover:border-gray-300 transition-colors"
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
              {isAnswersLoading ? (
                <div className="text-center py-8">
                  <Loader className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                </div>
              ) : sortedAnswers.length > 0 ? (
                sortedAnswers.map((answer) => (
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    onVote={(val) => voteAnswer({ answerId: answer.id, value: val })}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-400 flex flex-col items-center gap-2 shadow-xs">
                  <MessageSquare size={36} className="text-gray-300" />
                  <p className="text-sm font-medium">{t("QandAPage.noAnswersFallback")}</p>
                </div>
              )}
            </div>

            {/* Answer Input Box */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
              <form onSubmit={handlePostAnswer} className="flex gap-3">
                <img
                  src={currentUser?.avatar || "/default-avatar.png"}
                  alt={currentUser?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <div className="flex-1 relative flex gap-2">
                  <input
                    type="text"
                    value={newAnswerContent}
                    onChange={(e) => setNewAnswerContent(e.target.value)}
                    placeholder={t("QandAPage.writeAnswerPlaceholder")}
                    className="flex-1 bg-[#F9FAFB] rounded-full border border-gray-200 px-5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isPostingAnswer || !newAnswerContent.trim()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isPostingAnswer ? t("QandAPage.postingAnswerButton") : t("QandAPage.postAnswerButton")}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sponsored Ad */}
            <Advertisement />

            {/* Top 10 Popular Questions */}
            <PopularQuestion limit={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- AnswerCard Component --- */
function AnswerCard({
  answer,
  onVote,
}: {
  answer: any;
  onVote: (value: number) => void;
}) {
  const { data: replies, postReply, likeReply, unlikeReply } = useReplies(answer.id);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | undefined>(undefined);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await postReply({
      content: replyText.trim(),
      parentReplyId: replyingToId,
    });
    setReplyText("");
    setShowReplyForm(false);
    setReplyingToId(undefined);
  };

  const activeVote = answer.votedByMe; // 1 (upvote), -1 (downvote), or undefined

  return (
    <div className="bg-[#F8FAFC] rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
      {/* Answer Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={answer.author.avatar || "/default-avatar.png"}
            alt={answer.author.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">{answer.author.name}</span>
              {answer.author.tierName && (
                <span
                  className="text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase"
                  style={{ backgroundColor: answer.author.badgeColor || "#CBD5E1" }}
                >
                  {answer.author.tierName}
                </span>
              )}
              <ContactButton />
            </div>
            <span className="text-[10px] text-gray-400">
              {FormatPublishDate(answer.createdAt)}
            </span>
          </div>
        </div>

        {/* Voting Controller */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200/80 rounded-full px-2.5 py-1">
          <button
            onClick={() => onVote(1)}
            className={`p-1 hover:text-green-500 rounded-full transition-colors cursor-pointer ${
              activeVote === 1 ? "text-green-500" : "text-gray-400"
            }`}
            title="Upvote"
          >
            <ThumbsUp size={14} fill={activeVote === 1 ? "currentColor" : "none"} />
          </button>
          <span className="text-xs font-bold text-gray-700 min-w-[20px] text-center">
            {answer.totalVoteValue}
          </span>
          <button
            onClick={() => onVote(-1)}
            className={`p-1 hover:text-red-500 rounded-full transition-colors cursor-pointer ${
              activeVote === -1 ? "text-red-500" : "text-gray-400"
            }`}
            title="Downvote"
          >
            <ThumbsDown size={14} fill={activeVote === -1 ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Answer Content */}
      <p className="text-gray-700 text-sm leading-relaxed pl-1">
        {answer.content}
      </p>

      {/* Reply Trigger */}
      <div className="flex items-center gap-4 pl-1 border-t border-gray-100/60 pt-2.5">
        <button
          onClick={() => {
            setShowReplyForm(!showReplyForm);
            setReplyingToId(undefined);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <CornerDownLeft size={13} />
          <span>Reply</span>
        </button>
      </div>

      {/* Reply input form */}
      {showReplyForm && (
        <form onSubmit={handlePostReply} className="flex gap-2 pl-4 items-center">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              replyingToId ? "Write a nested reply..." : "Write a reply to this answer..."
            }
            className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-900 outline-hidden focus:border-blue-500 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-[10px] font-bold disabled:opacity-50 cursor-pointer"
          >
            Post
          </button>
        </form>
      )}

      {/* Tree Thread for Nested Replies */}
      {replies && replies.length > 0 && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-200 ml-4 mt-2">
          {replies.map((reply: any) => (
            <div key={reply.id} className="relative pl-3 space-y-2">
              {/* Connector line for child reply */}
              <div className="absolute left-[-18px] top-4 w-4 h-0.5 bg-gray-200"></div>

              {/* Reply Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={reply.author.avatar || "/default-avatar.png"}
                    alt={reply.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-100"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900 text-xs">{reply.author.name}</span>
                      {reply.author.tierName && (
                        <span
                          className="text-[8px] font-extrabold px-1.5 py-0.25 rounded-full text-white uppercase"
                          style={{ backgroundColor: reply.author.badgeColor || "#CBD5E1" }}
                        >
                          {reply.author.tierName}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400">
                      {FormatPublishDate(reply.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Like / Unlike Reply */}
                <button
                  onClick={() => {
                    if (reply.likedByMe) {
                      unlikeReply(reply.id);
                    } else {
                      likeReply(reply.id);
                    }
                  }}
                  className={`flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer hover:text-red-500 ${
                    reply.likedByMe ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <ThumbsUp size={11} fill={reply.likedByMe ? "currentColor" : "none"} />
                  <span>{reply.likesCount}</span>
                </button>
              </div>

              {/* Reply content */}
              <p className="text-gray-700 text-xs pl-9 leading-relaxed">
                {reply.content}
              </p>

              {/* Nested Reply Trigger */}
              <div className="pl-9">
                <button
                  onClick={() => {
                    setShowReplyForm(true);
                    setReplyingToId(reply.id);
                  }}
                  className="flex items-center gap-0.5 text-[10px] font-semibold text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <CornerDownLeft size={10} />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}