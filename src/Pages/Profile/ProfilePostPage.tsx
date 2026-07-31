import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchUserPosts, fetchUserQuestions } from "../../Apis/UserApi";
import NavigationBar from "../../Components/shared/NavigationBar";
import { useTranslation } from "react-i18next";
import { Badge } from "../../Components/shared/Tag";
import { ContactButton } from "../../Components/shared/ContactButton";
import PostCard from "../../Components/Community/PostCard";
import { QuestionCard } from "../../Components/Q&A/QuestionCard";
import BounceLoading from "../../Components/shared/BounceLoading";
import { FileText, HelpCircle, Calendar, ArrowLeft } from "lucide-react";
import { FormatPublishDate } from "../../utils/DateFormater";

export default function ProfilePostPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "questions">("posts");

  const userId = id || "";

  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  const {
    data: postsData,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: ({ pageParam }) => fetchUserPosts(userId, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) => (lastPage?.hasMore ? lastPage.nextCursor : undefined),
    enabled: !!userId && activeTab === "posts",
  });

  const {
    data: questionsData,
    isLoading: isQuestionsLoading,
    fetchNextPage: fetchNextQuestions,
    hasNextPage: hasNextQuestions,
    isFetchingNextPage: isFetchingNextQuestions,
  } = useInfiniteQuery({
    queryKey: ["userQuestions", userId],
    queryFn: ({ pageParam }) => fetchUserQuestions(userId, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) => (lastPage?.hasMore ? lastPage.nextCursor : undefined),
    enabled: !!userId && activeTab === "questions",
  });

  const posts = postsData?.pages.flatMap((p: any) => p.posts || []) || [];
  const questions = questionsData?.pages.flatMap((p: any) => p.questions || []) || [];

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <NavigationBar page="profile" solidNav />
        <div className="max-w-4xl mx-auto px-4 pt-28 flex justify-center">
          <BounceLoading />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <NavigationBar page="profile" solidNav />
        <div className="max-w-4xl mx-auto px-4 pt-28 text-center">
          <h2 className="text-xl font-bold text-gray-800">{t("profile.userNotFound", "User Not Found")}</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
          >
            {t("common.goBack", "Go Back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <NavigationBar page="profile" solidNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
            <img
              src={userProfile.avatar || "/default-avatar.png"}
              alt={userProfile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-gray-100"
            />
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">{userProfile.name}</h1>
                  {userProfile.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 justify-center sm:justify-start">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {t("profile.joined", "Joined {{date}}", {
                          date: FormatPublishDate(new Date(userProfile.createdAt)),
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5 justify-center sm:justify-start">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-bold text-gray-800">{userProfile.counts?.posts ?? 0}</span>
                      {t("profile.postsTab", "Posts")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span className="font-bold text-gray-800">{userProfile.counts?.questions ?? 0}</span>
                      {t("profile.questionsTab", "Questions")}
                    </span>
                  </div>
                </div>

                <ContactButton receiverId={userProfile.id} />
              </div>

              {/* Tier Badge with hover tooltip */}
              {userProfile.tier && (
                <div className="relative group inline-block">
                  <Badge tier={userProfile.tier.name} color={userProfile.tier.badgeColor} />
                  {userProfile.tier.description && (
                    <div className="absolute top-full mt-2 start-0 z-50 w-64 bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                      <p className="leading-relaxed">{userProfile.tier.description}</p>
                      <div className="absolute -top-1 start-4 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "posts"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("profile.postsTab", "Posts")}</span>
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "questions"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t("profile.questionsTab", "Questions")}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {isPostsLoading ? (
              <BounceLoading />
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                {t("profile.noPosts", "No posts yet.")}
              </div>
            ) : (
              posts.map((post: any) => <PostCard key={post.id} post={post} />)
            )}
            {hasNextPosts && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => fetchNextPosts()}
                  disabled={isFetchingNextPosts}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm shadow-sm"
                >
                  {isFetchingNextPosts ? t("common.loading", "Loading...") : t("common.loadMore", "Load More")}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-4">
            {isQuestionsLoading ? (
              <BounceLoading />
            ) : questions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                {t("profile.noQuestions", "No questions yet.")}
              </div>
            ) : (
              questions.map((question: any) => <QuestionCard key={question.id} question={question} />)
            )}
            {hasNextQuestions && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => fetchNextQuestions()}
                  disabled={isFetchingNextQuestions}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm shadow-sm"
                >
                  {isFetchingNextQuestions ? t("common.loading", "Loading...") : t("common.loadMore", "Load More")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}