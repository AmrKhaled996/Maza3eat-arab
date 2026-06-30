import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getCommentReplies, getCommentRepliesWithCursor } from "../../Apis/CommentsApi/Comment";



// function useGetCommentsReplies( commentId: string) {
//     return  useQuery({
//         queryKey: ["get-comment-replies"],
//         queryFn: () => getCommentReplies(commentId)
//     })
// }

// export default useGetCommentsReplies;

function useGetCommentsReplies( commentId: string ,cursor:string ="") {
    return  useQuery({
        queryKey: ["get-comment-replies", commentId],
        queryFn: () =>{
  
      if(cursor){
        return getCommentRepliesWithCursor(commentId, cursor);
      }
      return  getCommentReplies(commentId)},
      refetchOnWindowFocus: false,
    // initialPageParam: cursor,
    // getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });

}
// function useGetCommentsReplies( commentId: string ,cursor:string ="") {
//     return  useInfiniteQuery({
//         queryKey: ["get-comment-replies", commentId],
//         queryFn: ({ pageParam = cursor }) =>{
  
//       if(pageParam){
//         return getCommentRepliesWithCursor(commentId, pageParam);
//       }
//       return  getCommentReplies(commentId)},
//     initialPageParam: cursor,
//     getNextPageParam: (lastPage) => lastPage?.nextCursor,
//   });

// }

export default useGetCommentsReplies;