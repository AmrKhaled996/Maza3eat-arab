import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getCommunityPostsBySearch,
  getCommunityPostsBySearchWithCursor,
} from "../../Apis/CommunityApi/communitySearch";

export function useCommuintySearch(
  searchTerm: string = "",
  sortBy: string = "latest",
  cursor: string ="",
) {
  return useInfiniteQuery({
    queryKey: ["community-search-cursor"],
    queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getCommunityPostsBySearchWithCursor(searchTerm, sortBy, pageParam);
      }
      return  getCommunityPostsBySearch(searchTerm, sortBy)},
    initialPageParam: cursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
}

