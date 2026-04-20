import type { Post } from "../../../Types/Post";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";

interface PostAuthorCardProps {
  post: Post | undefined;
}

export default function PostAuthorCard({ post }: PostAuthorCardProps) {
  const navigate = useNavigate();
  const { lang } = useLocale();

  if (!post?.author) {
    return null;
  }

  return (
    <div
      onClick={() => navigate(localizedPath(lang, `profile/${post.author.id}`))}
      className="flex items-start gap-3 hover:opacity-80 cursor-pointer transition-opacity"
      dir="rtl"
    >
      <img
        src={post.author.avatar}
        alt={post.author.name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow flex-shrink-0"
        style={{ outlineColor: post.author.badgeColor, outlineWidth: 2 }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{post.author.name}</p>
        {post.author.tierName && (
          <span
            style={{ backgroundColor: post.author.badgeColor }}
            className="inline-block text-xs font-bold px-1.5 py-0.5 rounded text-white mt-0.5"
          >
            {post.author.tierName}
          </span>
        )}
      </div>
    </div>
  );
}
