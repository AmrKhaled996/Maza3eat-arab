import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../Apis/ProfileApi/profile-api";
import type { UserPostsResponse } from "../../Types/Profile/profile-types";

export default function useGetUserPosts(userId: string) {
  return useInfiniteQuery<UserPostsResponse>({
    queryKey: ["userPosts", userId],

    queryFn: ({ pageParam = null }) =>
      getUserPosts({ pageParam, userId }),
    
    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage.hasMore
        ? lastPage.nextCursor
        : undefined;
    },
  });
}