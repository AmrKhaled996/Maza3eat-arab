import { useEffect, useRef, useState } from "react";
import type { Comment } from "../../Types/Comment";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItems";
import { useParams } from "react-router-dom";
import useGetCommentsByPostId from "../../Hooks/CommentHooks/useGetCommentsByPostId";
import { useAuth } from "../../Context/Auth";

// const commentsData: Comment[] = [
//   {
//     id: "4c9ec43e-991b-4292-b3ed-48e9343579e0",
//     postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
//     authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//     content: "It is an amazing place!6",
//     likesCount: 29,
//     repliesCount: 16,
//     createdAt: new Date(),
//     author: {
//       id: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//       name: "Ali Magdy",
//       avatar: "https://i.pravatar.cc/40?img=1",
//       tierName: "silver",
//       badgeColor: "#7a6d6dff",
//     },
//     likedByMe: false,
//   },
//   {
//     id: "fe6e06b6-2bfb-4c78-a0df-cd6659f48762",
//     postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
//     authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//     content: "It is an amazing place!5",
//     likesCount: 0,
//     repliesCount: 0,
//     createdAt: new Date(),
//     author: {
//       id: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//       name: "Ali Magdy",
//       avatar: "https://i.pravatar.cc/40?img=1",
//       tierName: "silver",
//       badgeColor: "#7a6d6dff",
//     },
//     likedByMe: false,
//   },
//   {
//     id: "d6786cbb-18fe-4076-8e2a-aacbb9b0282a",
//     postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
//     authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//     content: "It is an amazing place!4",
//     likesCount: 0,
//     repliesCount: 0,
//     createdAt: new Date(),
//     author: {
//       id: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//       name: "Ali Magdy",
//       avatar: "https://i.pravatar.cc/40?img=1",
//       tierName: "silver",
//       badgeColor: "#7a6d6dff",
//     },
//     likedByMe: false,
//   },
//   {
//     id: "11838cc7-455f-413f-b8a7-b5e2351b80a1",
//     postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
//     authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//     content: "It is an amazing place!3",
//     likesCount: 0,
//     repliesCount: 0,
//     createdAt: new Date(),
//     author: {
//       id: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//       name: "Ali Magdy",
//       avatar: "https://i.pravatar.cc/40?img=1",
//       tierName: "silver",
//       badgeColor: "#7a6d6dff",
//     },
//     likedByMe: false,
//   },
//   {
//     id: "be39ca6f-4176-4bb0-a553-e1b607a27b31",
//     postId: "67f528b9-54cf-4c65-ac8d-00ca143186d9",
//     authorId: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//     content: "It is an amazing place!",
//     likesCount: 0,
//     repliesCount: 0,
//     createdAt: new Date(),
//     author: {
//       id: "01ba7079-7d55-4749-8764-64de5bc3c99c",
//       name: "Ali Magdy",
//       avatar: "https://i.pravatar.cc/40?img=1",
//       tierName: "silver",
//       badgeColor: "#7a6d6dff",
//     },
//     likedByMe: false,
//   },
// ];
export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();
  const { id: postIdparam } = useParams<{ id: string }>();
  const lastCommentRef = useRef<HTMLDivElement>(null);

  if (!postIdparam) return null;

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useGetCommentsByPostId(postIdparam);

  // const handleAddComment = (text: string) => {
  //   const newComment: Comment = {
  //     id: Date.now(),
  //     author: {
  //       name: "أنت",
  //       avatar: "https://i.pravatar.cc/40?img=3",
  //       badge: "Gold",
  //     },
  //     time: "الآن",
  //     text,
  //     likes: 0,
  //     replies: [],
  //   };

  // setComments((prev) => [newComment, ...prev]);
  // };
  // useEffect(() => {
  //   if (postCommentsResponse?.data) {
  //     setComments(postCommentsResponse.data.data.comments);
  //   }
  // }, [postCommentsResponse]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
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
      console.log("loading");
      if (isFetching) {
      }
    }
  }, [data]);

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      {user && <CommentInput />}

      <div className="flex flex-col gap-5 max-w-2xl">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonComment key={index} />
          ))
        ) : (
          <div>
            {comments?.map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
            {isFetchingNextPage && <SkeletonComment indent />}
            <div ref={lastCommentRef} className="w-full h-2"></div>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonComment({ indent = false }) {
  return (
    <div className={`flex gap-3 animate-pulse ${indent ? "mr-10" : ""}`}>
      <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
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
