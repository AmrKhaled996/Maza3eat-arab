import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReplies,
  createReply,
  createReplyToReply,
  likeReply,
  unlikeReply,
} from "../../Apis/Qus&AnsApi/QandAApis";

export function useReplies(answerId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["replies", answerId],
    queryFn: () => getReplies(answerId),
    enabled: !!answerId,
  });

  const replyMutation = useMutation({
    mutationFn: ({ content, parentReplyId }: { content: string; parentReplyId?: string }) => {
      if (parentReplyId) {
        return createReplyToReply(parentReplyId, content);
      }
      return createReply(answerId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", answerId] });
      queryClient.invalidateQueries({ queryKey: ["answers"] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (replyId: string) => likeReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", answerId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (replyId: string) => unlikeReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", answerId] });
    },
  });

  return {
    ...query,
    postReply: replyMutation.mutateAsync,
    likeReply: likeMutation.mutate,
    unlikeReply: unlikeMutation.mutate,
    isReplying: replyMutation.isPending,
  };
}
