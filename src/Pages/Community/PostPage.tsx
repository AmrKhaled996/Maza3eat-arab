import { useParams, useNavigate } from "react-router-dom";
import usePostDetail from "../../Hooks/PostHooks/usePostDetail";
import NavigationBar from "../../Components/shared/NavigationBar";
import PostAuthorCard from "../../Components/Community/PostDetail/PostAuthorCard";
import PostImageCarousel from "../../Components/Community/PostDetail/PostImageCarousel";
import PostContent from "../../Components/Community/PostDetail/PostContent";
import PostInteractions from "../../Components/Community/PostDetail/PostInteractions";
import Advertisement from "../../Components/shared/Advertisement";
import { Loader, ArrowLeft, Calendar } from "lucide-react";
import { FormatPublishDate } from "../../utils/DateFormater";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = usePostDetail(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen pb-16">
        <NavigationBar page="post" solidNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
            <p className="text-gray-600">The post you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <NavigationBar page="post" solidNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar - Author (col-span-2) */}
          <div className="md:col-span-2 order-2 md:order-1">
            <PostAuthorCard post={post} />
          </div>

          {/* Main Content - Post (col-span-7) */}
          <div className="md:col-span-7 space-y-6 order-1 md:order-2">
            {/* Post Title */}
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>

            {/* Image Carousel */}
            <PostImageCarousel post={post} />

            {/* Content (without title) */}
            <PostContent post={post} hideTitle />

            {/* Interactions */}
            <PostInteractions post={post} />

          </div>

          {/* Right Sidebar - Date (col-span-3) */}
          <div className="md:col-span-3 order-3">
            {post.publishDate && (
              <div className="sticky top-24 bg-white rounded-xl p-6 ">
                <div className="flex flex-row items-center gap-3">
                  <Calendar className="h-6 w-6 text-gray-600" />
                  <p className="text-sm font-medium text-gray-500">
                    {FormatPublishDate(post.publishDate)}
                  </p>
                </div>
              </div>
            )}
            {/* Advertisement */}
            <Advertisement className="sticky top-40" />
          </div>
        </div>
      </div>
    </div>
  );
}