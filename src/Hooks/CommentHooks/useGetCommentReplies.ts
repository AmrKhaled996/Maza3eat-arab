import {  useQuery } from "@tanstack/react-query";
import { getCommentReplies, getCommentRepliesWithCursor } from "../../Apis/CommentsApi/Comment";



function useGetCommentsReplies( commentId: string ,cursor:string ="" ,excludeCommentId?: string , enabled?: boolean) {
    return  useQuery({
        queryKey: ["get-comment-replies", commentId, excludeCommentId ?? null],
        queryFn: () =>{
  
      if(cursor){
        return getCommentRepliesWithCursor(commentId, cursor ,excludeCommentId);
      }
      return  getCommentReplies(commentId, excludeCommentId)} ,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      enabled: !!commentId && enabled

  });

}

export default useGetCommentsReplies;