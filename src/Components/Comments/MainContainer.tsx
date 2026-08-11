import { useEffect, useRef, useState } from "react";
import type { Comment as CommentType } from "../../Types/Comment";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItems";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useGetCommentsByPostId from "../../Hooks/CommentHooks/useGetCommentsByPostId";
import { useAuth } from "../../Context/Auth";

export default function CommentsSection() {
  const [comments, setComments] = useState<CommentType[]>([]);
  // const [newComment, setNewComment] = useState<Comment>();
  const { user } = useAuth();
  const { id: postIdparam } = useParams<{ id: string }>();
  const lastCommentRef = useRef<HTMLDivElement>(null);
  const [nextCursor, setNextCursor] = useState("");
  const HighlightedComment = useLocation().state?.comment;
const [searchParams] = useSearchParams();

const HighlightedCommentID = searchParams.get("highlighted")||"";

  

  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
    useGetCommentsByPostId(postIdparam ?? "", nextCursor ,HighlightedCommentID );



  const handleAddComment = (comment: CommentType) => {
    setComments((prev) => [comment, ...prev]);
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        console.log("is fetching comments");
        fetchNextPage();
      }
    });

    if (lastCommentRef.current) observer.observe(lastCommentRef.current);

    return () => {
      if (lastCommentRef.current) observer.unobserve(lastCommentRef.current);
    };
  }, [fetchNextPage]);

  useEffect(() => {

    if (data) {
      const allComments = data.pages.flatMap((page: any) => page?.comments);
      setComments(allComments);
      setNextCursor(data?.pages[data?.pages.length - 1]?.nextCursor);
    }
  }, [data]);

  if (!postIdparam) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6" dir="rtl">
      {user && (
        <div className="w-full">
          <CommentInput onAddComment={handleAddComment} />
        </div>
      )}

      <div className="flex flex-col gap-5 max-w-2xl">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonComment key={index} />
          ))
        ) : (
          <div>
            {HighlightedComment&&<CommentItem key={HighlightedComment?.id} comment={HighlightedComment} />}
            {comments?.map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>
        )}
        {isFetchingNextPage && (
          <div className="flex flex-col gap-3 animate-pulse">
            <SkeletonComment indent />
            <SkeletonComment indent />
            <SkeletonComment indent />
          </div>
        )}
        <div ref={lastCommentRef} className="w-full h-3"></div>
      </div>
    </div>
  );
}

function SkeletonComment({ indent = false }) {
  return (
    <div className={`flex gap-3 animate-pulse ${indent ? "mr-10" : ""}`}>
      <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="h-3 w-24 bg-gray-200 rounded-full" />
          <div className="h-3 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full" />
        <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
