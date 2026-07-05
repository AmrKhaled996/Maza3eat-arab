import { useQuery } from "@tanstack/react-query";
import { getReplyReplies, getReplyRepliesWithCursor } from "../../Apis/AnswersApi/AnswerReplies";



function useGetReplysReplys(replyId: string, cursor: string = "") {
  return useQuery({
    queryKey: ["get-answer-reply-replies", replyId],
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
