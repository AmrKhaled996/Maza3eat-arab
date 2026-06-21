import { useQuery } from "@tanstack/react-query";
import { getReplyReplies } from "../../Apis/CommentsApi/CommentReplies";

function useGetReplysReplys(replyId: string) {
  return useQuery({
    queryKey: ["get-reply-replies", replyId],
    queryFn: () => getReplyReplies(replyId),
  });
}

export default useGetReplysReplys;
