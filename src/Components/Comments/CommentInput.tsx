import { useState } from "react";
import { createComment } from "../../Apis/CommentsApi/Comment";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../Context/Auth";
import { LoaderIcon } from "lucide-react";
import type { Comment } from "../../Types/Comment";
import { useTranslation } from "react-i18next";

function CommentInput({onAddComment}:{onAddComment:(comment:Comment)=>void}) {
  const { t } = useTranslation();
  const [commentValue, setCommentValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id: postIdparam } = useParams<{ id: string }>();
  const { user } = useAuth();
 

  const handleComment = async () => {
    const content = commentValue.trim();

    if (!content) return;

    if (!postIdparam) {
      console.error("no post id");
      return;
    }

    if (content.length > 1000) {
      console.error("Comment is too long");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createComment(content, postIdparam);
      console.log("the response", response);
      onAddComment(response?.data?.data);
      setCommentValue("");
    } catch (error) {
      console.error(error);
      console.error("Failed to create comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center max-w-xl justify-center mx-auto gap-3 mb-8 bg-white rounded-2xl p-3 w-full ">
      <img
        src={user?.avatar}
        alt={user?.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white outline-3 shadow shrink-0"
        style={{ outlineColor: user?.tier?.badgeColor }}
      />
      <input
        value={commentValue}
        onChange={(e) => {
          setCommentValue(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleComment()}
        placeholder={t("comments.placeholder")}
        className="w-full max-w-xl rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={() => handleComment()}
        className={`text-white text-sm font-bold px-5 py-2 rounded-full shrink-0 hover:opacity-90 transition-opacity shadow hover:cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{ background: "linear-gradient(135deg, #2563eb, #9333ea)" }}
      >
        {isSubmitting ? (
          <>
            <LoaderIcon className="animate-spin" />
          </>
        ) : (
          t("comments.publish")
        )}
      </button>
    </div>
  );
}

export default CommentInput;
