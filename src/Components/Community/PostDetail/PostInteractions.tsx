import { Heart, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Post } from "../../../Types/Post";
import  { likeToPost } from "../../../Apis/PostsApi/actionPost";
import  { unlikeToPost } from "../../../Apis/PostsApi/actionPost";
import { playLikeSound } from "../../../utils/sounds";

interface PostInteractionsProps {
  post: Post | undefined;
}

export default function PostInteractions({ post }: PostInteractionsProps) {
  const { t } = useTranslation("common");
  const [liked, setLiked] = useState(Boolean(post?.likedByMe));
  const [likes, setLikes] = useState(post?.likesCount || 0);
  const [isSaved, setIsSaved] = useState(false);

  if (!post) {
    return null;
  }

  const handleLike = async () => {
    const wasLiked = liked;
    const previousLikes = likes;

    setLiked(!wasLiked);
    setLikes(previousLikes + (wasLiked ? -1 : 1));
    if (!wasLiked) playLikeSound();

    try {
      if (wasLiked) {
        console.log("postid in here:",post.id)
        await unlikeToPost(post.id);
      } else {

        await likeToPost(post.id);
      }
    } catch (error) {
      setLiked(wasLiked);
      setLikes(previousLikes);
      console.error(error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
        console.error("Failed to share:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs flex gap-3 justify-between">
      {/* Like Button */}
      <button
        onClick={handleLike}
        aria-pressed={liked}
        className={`group flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer active:scale-95 ${
          liked
            ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/20"
            : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <Heart
          className={`h-5 w-5 transition-all duration-300 ${
            liked
              ? "fill-white text-white scale-110"
              : "text-gray-500 group-hover:text-red-500 group-hover:scale-110"
          }`}
        />
        <span>{likes}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="group flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-bold text-sm transition-all duration-300 cursor-pointer active:scale-95 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <Share2 className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
        <span>{t("post.share")}</span>
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        aria-pressed={isSaved}
        className={`group flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer active:scale-95 ${
          isSaved
            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/20"
            : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
        }`}
      >
        <Bookmark
          className={`h-5 w-5 transition-all duration-300 ${
            isSaved
              ? "fill-white text-white scale-110"
              : "text-gray-500 group-hover:text-amber-600 group-hover:scale-110"
          }`}
        />
        <span>{t("post.save")}</span>
      </button>
    </div>
  );
}
