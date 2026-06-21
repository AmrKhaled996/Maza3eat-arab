import { useQuery } from "@tanstack/react-query";
import { getCommentReplies } from "../../Apis/CommentsApi/Comment";



function useGetCommentsReplies( commentId: string) {
    return  useQuery({
        queryKey: ["get-comment-replies"],
        queryFn: () => getCommentReplies(commentId)
    })
}

export default useGetCommentsReplies;