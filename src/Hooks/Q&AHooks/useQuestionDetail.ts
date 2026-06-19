import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getQuestionById,
  likeQuestion,
  unlikeQuestion,
  deleteQuestion,
} from "../../Apis/Qus&AnsApi/QandAApis";

export function useQuestionDetail(questionId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestionById(questionId),
    enabled: !!questionId,
  });

  const likeMutation = useMutation({
    mutationFn: () => likeQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      queryClient.invalidateQueries({ queryKey: ["Question-search-cursor"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      queryClient.invalidateQueries({ queryKey: ["Question-search-cursor"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Question-search-cursor"] });
    },
  });

  return {
    ...query,
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    deleteQuestion: deleteMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
