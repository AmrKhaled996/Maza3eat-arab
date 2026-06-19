import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnswers, createAnswer, voteAnswer } from "../../Apis/Qus&AnsApi/QandAApis";

export function useAnswers(questionId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["answers", questionId],
    queryFn: () => getAnswers(questionId),
    enabled: !!questionId,
  });

  const postAnswerMutation = useMutation({
    mutationFn: (content: string) => createAnswer(questionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
  });

  const voteAnswerMutation = useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: number }) =>
      voteAnswer(answerId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
  });

  return {
    ...query,
    postAnswer: postAnswerMutation.mutate,
    voteAnswer: voteAnswerMutation.mutate,
    isPosting: postAnswerMutation.isPending,
    isVoting: voteAnswerMutation.isPending,
  };
}
