import {  useQuery } from "@tanstack/react-query";
import { getCommentReplies, getCommentRepliesWithCursor } from "../../Apis/CommentsApi/Comment";



function useGetCommentsReplies( commentId: string ,cursor:string ="") {
    return  useQuery({
        queryKey: ["get-comment-replies", commentId],
        queryFn: () =>{
  
      if(cursor){
        return getCommentRepliesWithCursor(commentId, cursor);
      }
      return  getCommentReplies(commentId)},
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false

  });

}

export default useGetCommentsReplies;