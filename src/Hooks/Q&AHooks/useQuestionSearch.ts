import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuestionsBySearch, getQuestionsBySearchWithCursor } from "../../Apis/Qus&AnsApi/QandASearch";


export function useQuestionsSearch(
  searchTerm: string = "",
  sortBy: string = "latest",
  cursor: string ="",
) {
  return useInfiniteQuery({
    queryKey: ["Question-search-cursor"],
    queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getQuestionsBySearchWithCursor(searchTerm, sortBy, pageParam);
      }
      return  getQuestionsBySearch(searchTerm, sortBy)},
    initialPageParam: cursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
}