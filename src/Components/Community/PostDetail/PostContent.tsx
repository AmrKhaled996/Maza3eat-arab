import type { Post } from "../../../Types/Post";
import { Tag } from "../../../Components/shared/Tag";
import "react-quill-new/dist/quill.snow.css";

interface PostContentProps {
  post: Post | undefined;
  hideTitle?: boolean;
}

export default function PostContent({ post, hideTitle = false }: PostContentProps) {
  if (!post) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      {/* Title */}
      {!hideTitle && (
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      )}

      {/* Content */}
      <div className="ql-snow">
        <div
          className="text-gray-700 leading-relaxed break-words ql-editor min-h-[200px] select-text"
          dir="auto"
          style={{ padding: 0, border: "none" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {post.tags.map((tag) => (
            <Tag key={tag.name} label={`#${tag.name}`} />
          ))}
        </div>
      )}
    </div>
  );
}
