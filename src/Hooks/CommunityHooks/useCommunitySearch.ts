import { useInfiniteQuery } from "@tanstack/react-query";
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
    queryKey: ["community-search-cursor", searchTerm, sortBy],
    queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getCommunityPostsBySearchWithCursor(searchTerm, sortBy, pageParam);
      }
      return  getCommunityPostsBySearch(searchTerm, sortBy)},
    initialPageParam: cursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
}

