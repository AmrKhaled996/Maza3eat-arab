import type { Post } from "../../../Types/Post";
import { Tag } from "../../../Components/shared/Tag";
import "react-quill-new/dist/quill.snow.css";
import { useLocale } from "../../../i18n/useLocale";
import DOMPurify from "dompurify";

interface PostContentProps {
  post: Post | undefined;
  hideTitle?: boolean;
}

export default function PostContent({
  post,
  hideTitle = false,
}: PostContentProps) {
  const { lang } = useLocale();
  if (!post) {
    return null;
  }

  return (
    <div 
    onClick={()=>{console.log((post as any).scope,"post:",post)}}
    className="bg-white rounded-2xl p-6 space-y-4">
      {/* Title */}
      {!hideTitle && (
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      )}

      {/* Content */}
      <div className="ql-snow " dir="rtl">
        <div
          dir="auto"
          className={`
          text-gray-700
          wrap-break-word
          min-h-[200px]
          select-text
          scrollbar-hide
          max-w-none
        `}
          data-gramm="false"
          style={{
            padding: 2,
            border: "none",
            wordBreak: "normal",
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content, {
              ADD_ATTR: ["target", "rel"],
            }),
          }}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          {post.tags.map((tag) => (
            <Tag key={tag.name} label={`#${tag.name}`} 
            dir={(post as any).scope==="admin" ? "featured": "community"}/>
          ))}
        </div>
      )}
    </div>
  );
}
