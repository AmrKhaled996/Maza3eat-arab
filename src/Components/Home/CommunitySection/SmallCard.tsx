import { Heart } from "lucide-react";

import type { Post } from "../../../Types/Post";
import type { Tag as TagType } from "../../../Types/Tag";

import { Badge, Tag } from "../../shared/Tag";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";
import PostsComments from "../../../assets/images/icons/PostComments";

function HomeCommunitySectionSmallCard(props: Post) {
  const post: Post = props;
  const navigate = useNavigate();
  const { lang } = useLocale();
  return (
    <div
      onClick={() => navigate(localizedPath(lang, `post/${post.id}`))}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group flex flex-col hover:cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={post?.image?.url}
          alt={post?.image?.name}
          className="w-full sm:h-44 h-64 object-cover group-hover:scale-105  transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 flex gap-1.5 flex-wrap">
          {post?.tags?.map((t: TagType, index: number) => (
            <Tag key={index} label={t?.name} />
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img
              src={post?.author?.avatar}
              alt={post?.author?.name}
              style={{ outlineColor: post.author.badgeColor }}
              className={`w-8 h-8 rounded-full outline-3  object-cover ring-2 ring-white shadow`}
            />
            <span className="text-xs font-semibold text-gray-700">
              {post.author?.name || "amr"}
            </span>
          </div>
          <Badge
            tier={post?.author?.tierName}
            color={post?.author?.badgeColor}
          />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1 flex-1">
          {post?.content}
        </p>
        <div className="flex items-center gap-4 text-xs ">
          <button className={`flex items-center gap-1  text-red-500 `}>
            <span>
              <Heart size={16} fill={"red"} />
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

export default HomeCommunitySectionSmallCard;
