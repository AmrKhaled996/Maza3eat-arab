import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentsByPostId, getCommentsByPostIdWithCursor } from "../../Apis/CommentsApi/Comment";



function useGetCommentsByPostId( postId: string ,cursor:string ="" , excludeCommentId?: string) {
    return  useInfiniteQuery({
        queryKey: ["get-post-comment", postId, excludeCommentId ?? null],
        queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getCommentsByPostIdWithCursor(postId, pageParam ,excludeCommentId);
      }
      return  getCommentsByPostId(postId ,excludeCommentId)} ,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!postId,
  });

}

export default useGetCommentsByPostId;
