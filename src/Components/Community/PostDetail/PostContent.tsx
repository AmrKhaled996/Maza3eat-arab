import type { Post } from "../../../Types/Post";
import { Tag } from "../../../Components/shared/Tag";
import "react-quill-new/dist/quill.snow.css";
import { useLocale } from "../../../i18n/useLocale";

interface PostContentProps {
  post: Post | undefined;
  hideTitle?: boolean;
}

export default function PostContent({ post, hideTitle = false }: PostContentProps) {
  const { lang } = useLocale();
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
      <div className="ql-snow ">
        <div
          className={`text-gray-700 leading-relaxed wrap-break-word ql-editor min-h-[200px] select-text scrollbar-hide  prose prose-sm max-w-none
    ${lang === "ar" ? "text-right prose-ul:pr-6 prose-ol:pr-6 prose-ul:pl-0 prose-ol:pl-0  " : "text-left force-ltr"}
    leading-8
    prose-p:my-2
    prose-p:leading-8
    prose-li:my-2
    prose-li:leading-8`}

          data-gramm="false"
          data-value="left"
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
