import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentsByPostId, getCommentsByPostIdWithCursor } from "../../Apis/CommentsApi/Comment";



function useGetCommentsByPostId( postId: string ,cursor:string ="" , excludeCommentId?: string) {
    return  useInfiniteQuery({
        queryKey: ["get-post-comment"],
        queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getCommentsByPostIdWithCursor(postId, pageParam ,excludeCommentId);
      }
      return  getCommentsByPostId(postId ,excludeCommentId)} ,
    initialPageParam: cursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });

}

export default useGetCommentsByPostId;
