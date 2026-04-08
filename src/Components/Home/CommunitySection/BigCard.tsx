import { Heart } from "lucide-react";
import type { Post } from "../../../Types/Post";
import type { Tag as TagType } from "../../../Types/Tag";

import { Badge, Tag } from "../../shared/Tag";
import { useNavigate } from "react-router-dom";
import PostsComments from "../../../assets/images/icons/PostComments";

function HomeCommunitySectionBigCard(props: Post) {
  const post: Post = props;
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/post/:${post.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group hover:cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={post?.image?.url}
          alt={post?.image?.name}
          className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 hover:cursor-pointer transition-transform duration-500"
        />
        <div className="absolute bottom-3 right-3 flex gap-2 flex-wrap">
          {post?.tags?.map((t: TagType, index: number) => (
            <Tag key={index} label={t?.name} />
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={post?.author?.avatar}
              alt={post?.author?.name}
              style={{ outlineColor: post?.author?.badgeColor }}
              className={`w-9 h-9 rounded-full outline-3  object-cover ring-2 ring-white shadow`}
              loading="lazy"
            />
            <span className="text-sm font-semibold text-gray-700">
              {post?.author?.name}
            </span>
          </div>
          <Badge
            tier={post?.author?.tierName}
            color={post?.author?.badgeColor}
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
          {post?.title}
        </h2>
        <p className="text-sm text-gray-500 max line-clamp-2 leading-relaxed mb-4">
          {post?.content}
        </p>
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
      </div>
    </div>
  );
}

export default HomeCommunitySectionBigCard;
