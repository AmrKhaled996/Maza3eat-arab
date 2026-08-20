import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchUserProfile,
  fetchUserPosts,
  fetchUserQuestions,
} from "../../Apis/UserApi";
import NavigationBar from "../../Components/shared/NavigationBar";
import { useTranslation } from "react-i18next";
import { Badge } from "../../Components/shared/Tag";
import { ContactButton } from "../../Components/shared/ContactButton";
import PostCard from "../../Components/Community/PostCard";
import { QuestionCard } from "../../Components/Q&A/QuestionCard";
import BounceLoading from "../../Components/shared/BounceLoading";
import {
  FileText,
  HelpCircle,
  Calendar,
  ArrowLeft,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { FormatPublishDate } from "../../utils/DateFormater";
import Avatar from "../../Components/shared/Avatar";
import { useAuth } from "../../Context/Auth";
import cn from "../../utils/Cn";
import { useLocale } from "../../i18n/useLocale";
import {
  deleteUserPost,
  deleteUserQuestion,
} from "../../Apis/ProfileApi/profile-api";
import DeleteQuestionDialog from "../../Components/Profile/DeleteQuestionDialog";
import DeletePostDialog from "../../Components/Profile/DeletePostDialog";
import { useToast } from "../../Context/Toast";
import { Title } from "react-head";


export default function ProfilePostPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const { user } = useAuth();
  const {toast} = useToast();
  const navigate = useNavigate();

  const [profileQuestionsData, setProfileQuestionsData] = useState<any>([]);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string>("");
  const [deleteQuestionOpen, setDeleteQuestionOpen] = useState(false);
  const [deleteQuestionLoading, setDeleteQuestionLoading] = useState(false);
  const [questionSettingsOpen, setQuestionSettingsOpen] = useState(false);

  const [profilePostsData, setProfilePostsData] = useState<any>([]);
  const [deletePostId, setDeletePostId] = useState<string>("");
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [postSettingsOpen, setPostSettingsOpen] = useState(false);

  
  const [activeTab, setActiveTab] = useState<"posts" | "questions">("posts");
  
  const userId = id || "";
  
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });
  const [profilePostCount, setProfilePostCount] = useState<any>(userProfile?.counts?.posts || 0);
  const [profileQuestionCount, setProfileQuestionCount] = useState<any>(userProfile?.counts?.questions || 0);

  const {
    data: postsData,
    isLoading: isPostsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: ({ pageParam }) =>
      fetchUserPosts(userId, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) =>
      lastPage?.hasMore ? lastPage.nextCursor : undefined,
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
    queryFn: ({ pageParam }) =>
      fetchUserQuestions(userId, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) =>
      lastPage?.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!userId && activeTab === "questions",
  });

  const handleQuestionDelete = async (id: string) => {
    try {
      if (!id) return;
      setDeleteQuestionLoading(true);
      await deleteUserQuestion({ questionId: id });
      const newQuestions = profileQuestionsData.filter((q: any) => q.id !== id);
      setProfileQuestionsData(newQuestions);
      setProfileQuestionCount(profileQuestionCount - 1);
      toast.success(lang === "ar" ? "تم حذف السؤال بنجاح" : "Question deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? "حدث خطأ ما ، لم يتم حذف السؤال" : "Something went wrong , question not deleted");
    } finally {
      setDeleteQuestionLoading(false);
      setDeleteQuestionOpen(false);
    }
  };

  const handlePostDelete = async (id: string) => {
    try {
      if (!id) return;
      setDeletePostLoading(true);
      await deleteUserPost({ postId: id });
      const newPosts = profilePostsData.filter((q: any) => q.id !== id);
      setProfilePostsData(newPosts);
      setProfilePostCount(profilePostCount - 1);
      toast.success(lang === "ar" ? "تم حذف المنشور بنجاح" : "Post deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? "حدث خطأ ما ، لم يتم حذف المنشور" : "Something went wrong , post not deleted");
    } finally {
      setDeletePostLoading(false);
      setDeletePostOpen(false);
    }
  };

  useEffect(() => {
    const questions =
      questionsData?.pages.flatMap((p: any) => p.questions || []) || [];

    setProfileQuestionsData(questions);
  }, [questionsData]);

  useEffect(() => {
    const posts = postsData?.pages.flatMap((p: any) => p.posts || []) || [];

    setProfilePostsData(posts);
  }, [postsData]);

  useEffect(() => {
    if(userProfile){
      setProfilePostCount(userProfile?.counts?.posts);
      setProfileQuestionCount(userProfile?.counts?.questions);
    }
  },[userProfile])




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
          <h2 className="text-xl font-bold text-gray-800">
            {t("profile.userNotFound", "User Not Found")}
          </h2>
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

      <Title>{t("profile.profileTitle") + " - " + userProfile.name}</Title>
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
            <Avatar
              src={userProfile.avatar || "/default-avatar.png"}
              name={userProfile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-gray-100 outline-4"
              style={{ outlineColor: userProfile?.tier?.badgeColor }}
            />
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 flex gap-5 ">
                    {userProfile.name}
                    {user?.id !== userId && (
                      <ContactButton receiverId={userProfile.id} />
                    )}
                  </h1>

                  {userProfile.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 justify-center sm:justify-start">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {t("profile.joined", "Joined {{date}}", {
                          date: FormatPublishDate(
                            new Date(userProfile.createdAt),
                          ),
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4  text-gray-500 justify-center sm:justify-start my-4">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-bold text-gray-800">
                        {profilePostCount}
                      </span>
                      {t("profile.postsTab", "Posts")}
                    </span>
                    <span className="flex items-center gap-1.5 ">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span className="font-bold text-gray-800 ">
                        {profileQuestionCount}
                      </span>
                      {t("profile.questionsTab", "Questions")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier Badge with hover tooltip */}
              {userProfile.tier && (
                <div className="relative group inline-block">
                  <Badge
                    tier={userProfile.tier.name}
                    color={userProfile.tier.badgeColor}
                  />
                  {userProfile.tier.description && (
                    <div className="absolute top-full mt-2 start-0 z-50 w-64 bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                      <p className="leading-relaxed">
                        {userProfile.tier.description}
                      </p>
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
            ) : profilePostsData.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                {t("profile.noPosts", "No posts yet.")}
              </div>
            ) : (
              profilePostsData.map((post: any) => (
                <div key={post.id} className="flex gap-1">
                  <div className="w-full">
                    <PostCard key={post.id} post={post} status={post.status} />
                  </div>
                  {post.permissions.canDelete && (
                    <div
                      key={post.id}
                      onClick={() =>
                        setPostSettingsOpen((prev) =>
                          prev === post.id ? null : post.id,
                        )
                      }
                      className="p-2 bg-white rounded-full h-fit hover:cursor-pointer drop-shadow-md hover:shadow-sm hover:opacity-80 transition-all duration-300 relative"
                    >
                      <MoreHorizontal />
                      {postSettingsOpen === post.id && (
                        <div
                          className={cn(
                            `absolute top-11 z-20 `,
                            lang === "en" ? "right-0" : "left-0",
                          )}
                        >
                          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-20">
                            <button
                              onClick={() => {
                                setDeletePostOpen(true);
                                setDeletePostId(post.id);
                              }}
                              className="text-red-500 hover:text-red-600 hover:cursor-pointer  hover:opacity-80 transition-all duration-300 flex items-center gap-2 z-20"
                            >
                              <Trash2 /> {t("profile.menuDelete")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            {hasNextPosts && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => fetchNextPosts()}
                  disabled={isFetchingNextPosts}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm shadow-sm"
                >
                  {isFetchingNextPosts
                    ? t("common.loading", "Loading...")
                    : t("common.loadMore", "Load More")}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-4">
            {isQuestionsLoading ? (
              <BounceLoading />
            ) : profileQuestionsData.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
                {t("profile.noQuestions", "No questions yet.")}
              </div>
            ) : (
              profileQuestionsData.map((question: any) => (
                <div key={question.id} className="flex gap-1">
                  <div className="w-full">
                    <QuestionCard key={question.id} question={question} status={question.status} />
                  </div>
                  {question.permissions.canDelete && (
                    <div
                      key={question.id}
                      onClick={() =>
                        setQuestionSettingsOpen((prev) =>
                          prev === question.id ? null : question.id,
                        )
                      }
                      className="p-2 bg-white rounded-full h-fit hover:cursor-pointer shadow-sm hover:shadow-sm hover:opacity-80 transition-all duration-300 relative"
                    >
                      <MoreHorizontal />
                      {questionSettingsOpen === question.id && (
                        <div
                          className={cn(
                            `absolute top-11 z-20 `,
                            lang === "en" ? "right-0" : "left-0",
                          )}
                        >
                          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-20">
                            <button
                              onClick={() => {
                                setDeleteQuestionOpen(true);
                                setDeleteQuestionId(question.id);
                              }}
                              className="text-red-500 hover:text-red-600 hover:cursor-pointer  hover:opacity-80 transition-all duration-300 flex items-center gap-2 z-20"
                            >
                              <Trash2 /> {t("profile.menuDelete")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            {hasNextQuestions && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => fetchNextQuestions()}
                  disabled={isFetchingNextQuestions}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer text-sm shadow-sm"
                >
                  {isFetchingNextQuestions
                    ? t("common.loading", "Loading...")
                    : t("common.loadMore", "Load More")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {deleteQuestionOpen && (
        <DeleteQuestionDialog
          open={deleteQuestionOpen}
          onClose={() => setDeleteQuestionOpen(false)}
          onConfirm={() => handleQuestionDelete(deleteQuestionId)}
          loading={deleteQuestionLoading}
        />
      )}
      {deletePostOpen && (
        <DeletePostDialog
          open={deletePostOpen}
          onClose={() => setDeletePostOpen(false)}
          onConfirm={() => handlePostDelete(deletePostId)}
          loading={deletePostLoading}
        />
      )}
    </div>
  );
}
