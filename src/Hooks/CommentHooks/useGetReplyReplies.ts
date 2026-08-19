import { useQuery } from "@tanstack/react-query";
import {
  getReplyReplies,
  getReplyRepliesWithCursor,
} from "../../Apis/CommentsApi/CommentReplies";


function useGetReplysReplys(replyId: string, cursor: string = "",excludeReplyId?: string,enabled?:boolean) {
  return useQuery({
    queryKey: ["get-reply-replies", replyId, cursor,excludeReplyId],
    queryFn: () => {
      if (cursor) {
        return getReplyRepliesWithCursor(replyId, cursor,excludeReplyId);
      }
      return getReplyReplies(replyId,excludeReplyId);
    },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,

      enabled: !!replyId && enabled
  });
}
export default useGetReplysReplys;
