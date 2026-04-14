import { useInfiniteQuery } from "@tanstack/react-query";
import {  getUserQuestions } from "../../Apis/ProfileApi/profile-api";
import type { UserQuestionsResponse } from "../../Types/Profile/profile-types";

export default function useGetQuestionsPosts(userId: string) {
  return useInfiniteQuery<UserQuestionsResponse>({
    queryKey: ["userQuestions", userId],

    queryFn: ({ pageParam = null }) =>
      getUserQuestions({ pageParam, userId }),

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore
        ? lastPage.nextCursor
        : undefined;
    },
  });
}