import { Heart, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import type { Post } from "../../../Types/Post";
import  { likeToPost } from "../../../Apis/PostsApi/actionPost";
import  { unlikeToPost } from "../../../Apis/PostsApi/actionPost";
import { useTranslation } from "react-i18next";

interface PostInteractionsProps {
  post: Post | undefined;
}

export default function PostInteractions({ post }: PostInteractionsProps) {
  const { t } = useTranslation("common");
  const [liked, setLiked] = useState(post?.likedByMe);
  const [likes, setLikes] = useState(post?.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!post) {
    return null;
  }

  const handleLike = async () => {
    // console.log("postid:",post.id,"islikeing",isLiking)
    // if (!post?.id || isLiking) return;
 

    setIsLiking(true);

    const wasLiked = liked;
    const previousLikes = likes;

    setLiked(!wasLiked);
    setLikes(previousLikes + (wasLiked ? -1 : 1));

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
    } finally {
      setIsLiking(false);
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
    <div className="bg-white rounded-2xl p-6 flex gap-4 justify-between">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-red-50 transition-colors group"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            liked
              ? "fill-red-500 text-red-500"
              : "text-gray-600 group-hover:text-red-500"
          }`}
        />
        <span className="text-sm font-medium text-gray-700">{likes}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors group"
      >
        <Share2 className="h-5 w-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
        <span className="text-sm font-medium text-gray-700">Share</span>
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-amber-50 transition-colors group"
      >
        <Bookmark
          className={`h-5 w-5 transition-colors ${
            isSaved
              ? "fill-amber-500 text-amber-500"
              : "text-gray-600 group-hover:text-amber-500"
          }`}
        />
        <span className="text-sm font-medium text-gray-700">Save</span>
      </button>
    </div>
  );
}
