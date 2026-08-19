import { useQuery } from "@tanstack/react-query";
import {
  getAnswerReplies,
  getAnswerRepliesWithCursor,
} from "../../Apis/AnswersApi/Answers";

function useGetAnswerReplies(
  answerId: string,
  cursor: string = "",
  excludeAnswerId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["get-answer-replies", answerId, excludeAnswerId ?? null],
    queryFn: () => {
      if (cursor) {
        return getAnswerRepliesWithCursor(answerId, cursor, excludeAnswerId);
      }
      return getAnswerReplies(answerId, excludeAnswerId);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchInterval: false,

    enabled: !!answerId && enabled,
  });
}

export default useGetAnswerReplies;
