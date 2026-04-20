import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../Apis/PostsApi/getPost";
import type { Post } from "../../Types/Post";

function usePostDetail(postId: string) {
    return useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const res = await getPostById(postId);
            const data = res.data.data;
            
            // Transform backend response to match Post type
            return {
                id: postId,
                title: data.title,
                content: data.content,
                likesCount: data.likesCount,
                commentsCount: data.commentsCount,
                tags: data.tags,
                image: {
                    url: data.images?.[0]?.imageUrl || "",
                    name: data.images?.[0]?.originalName || "",
                    remainingImages: Math.max((data.images?.length || 1) - 1, 0),
                },
                author: data.author,
                publishDate: data.publishDate,
            } as Post;
        },
        enabled: !!postId,
    });
}

export default usePostDetail;
