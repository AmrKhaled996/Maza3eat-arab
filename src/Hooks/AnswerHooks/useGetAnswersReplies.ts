import { useQuery } from "@tanstack/react-query";
import {
  getAnswerReplies,
  getAnswerRepliesWithCursor,
} from "../../Apis/AnswersApi/Answers";

function useGetAnswerReplies(answerId: string, cursor: string = "") {
  return useQuery({
    queryKey: ["get-answer-replies", answerId],
    queryFn: () => {
      if (cursor) {
        return getAnswerRepliesWithCursor(answerId, cursor);
      }
      return getAnswerReplies(answerId);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export default useGetAnswerReplies;
