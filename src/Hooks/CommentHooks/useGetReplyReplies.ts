import { useQuery } from "@tanstack/react-query";
import {
  getReplyReplies,
  getReplyRepliesWithCursor,
} from "../../Apis/CommentsApi/CommentReplies";


function useGetReplysReplys(replyId: string, cursor: string = "") {
  return useQuery({
    queryKey: ["get-reply-replies", replyId, cursor],
    queryFn: () => {
      if (cursor) {
        return getReplyRepliesWithCursor(replyId, cursor);
      }
      return getReplyReplies(replyId);
    },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false
  });
}
export default useGetReplysReplys;
