import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getReplyReplies,
  getReplyRepliesWithCursor,
} from "../../Apis/CommentsApi/CommentReplies";

// function useGetReplysReplys(replyId: string) {
//   return useQuery({
//     queryKey: ,
//     queryFn: () => getReplyReplies(replyId),
//   });
// }

// function useGetReplysReplys(replyId: string, cursor: string = "") {
//   return useInfiniteQuery({
//     queryKey: ["get-reply-replies", replyId],
//     queryFn: ({ pageParam = cursor }) => {
//       if (pageParam) {
//         return getReplyRepliesWithCursor(replyId, pageParam);
//       }
//       return getReplyReplies(replyId);
//     },
//     initialPageParam: cursor,
//     getNextPageParam: (lastPage) => lastPage?.nextCursor,
//   });
// }

function useGetReplysReplys(replyId: string, cursor: string = "") {
  return useQuery({
    queryKey: ["get-reply-replies", replyId],
    queryFn: () => {
      if (cursor) {
        return getReplyRepliesWithCursor(replyId, cursor);
      }
      return getReplyReplies(replyId);
    },
    // initialPageParam: cursor,
    // getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchOnWindowFocus: false,
  });
}
export default useGetReplysReplys;
