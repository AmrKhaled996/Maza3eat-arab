import { Badge, Tag } from "../../Components/shared/Tag";
import type { Post } from "../../Types/Post";
import PostsComments from "../../assets/images/icons/PostComments";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
import type { Tag as TagType } from "../../Types/Tag";
import { useNavigate } from "react-router-dom";
import { FormatPublishDate } from "../../utils/DateFormater";

function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row gap-0 md:min-h-80 md:max-h-80 hover:cursor-pointer group "
    >
      {/* Image */}
      <div className="relative sm:w-52 md:w-80 shrink-0 overflow-hidden group-hover:scale-103 transition-transform duration-700 ease-in-out">
        <img
          src={post.image.url}
          alt={post.title}
          className="w-full sm:w-full h-52 sm:h-full object-cover min-h-52 max-h-80 rounded-xl rounded-b-none "
        />
        {post?.image?.remainingImages !== undefined &&
          post.image.remainingImages > 1 && (
            <span className="absolute w-8 h-8 top-3 right-3 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center justify-center">
              {post.image.remainingImages}
              <Plus size={24} strokeWidth={3} className=" font-bold" />
            </span>
          )}
      </div>

      {/* Content */}
      <div
        className="p-5 flex flex-col flex-1 group-hover:bg-black/1"
        dir="rtl"
      >
        {/* Author */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow outline-3"
            style={{ outlineColor: post.author.badgeColor }}
          />
          <span className="text-sm font-bold text-gray-800">
            {post.author.name}
          </span>
          <Badge tier={post.author.tierName} color={post.author.badgeColor} />

          <span className="mr-auto text-xs text-gray-400">
            {post?.publishDate ? FormatPublishDate(post.publishDate) : ""}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-snug">
          {post.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-3">
          {post.tags.map((t: TagType, i) => (
            <Tag key={i} label={t.name} />
          ))}
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 overflow-hidden my-4  px-2">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button
              className={`flex items-center gap-1.5 transition-colors text-red-500`}
            >
              <span>
                <Heart size={16} fill="red" />
              </span>
              <span className="font-medium">{post?.likesCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-blue-500 ">
              <span>
                <PostsComments color="#2563eb" />
              </span>
              <span className="font-medium">{post?.commentsCount}</span>
            </button>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-bold hover:opacity-75 transition-opacity"
            style={{ color: "#2563eb" }}
          >
            {"قراءة المقال كاملاً"}{" "}
            <ArrowUpRight size={16} className=" text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
