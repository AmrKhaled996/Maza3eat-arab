import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeaturedPostsBySearch, getFeaturedPostsBySearchWithCursor } from "../../Apis/FeaturedApi/featuredSearch";


export function useFeaturedSearch(
  searchTerm: string = "",
  sortBy: string = "latest",
  cursor: string ="",
) {
  return useInfiniteQuery({
    queryKey: ["Featured-search-cursor"],
    queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getFeaturedPostsBySearchWithCursor(searchTerm, sortBy, pageParam);
      }
      return  getFeaturedPostsBySearch(searchTerm, sortBy)},
    initialPageParam: cursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
}