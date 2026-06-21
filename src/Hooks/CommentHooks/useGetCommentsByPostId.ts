import { useQuery } from "@tanstack/react-query";
import { getCommentsByPostId } from "../../Apis/CommentsApi/Comment";



function useGetCommentsByPostId( postId: string) {
    return  useQuery({
        queryKey: ["get-post-comment"],
        queryFn: () => getCommentsByPostId(postId)
    })
}

export default useGetCommentsByPostId;