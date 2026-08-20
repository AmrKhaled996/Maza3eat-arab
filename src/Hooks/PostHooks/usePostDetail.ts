import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../Apis/PostsApi/getPost";
import type { Post } from "../../Types/Post";

function usePostDetail(postId: string) {
    return useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const res = await getPostById(postId);
            // Backend returns images as [{ imageUrl, originalName }], which is
            // wider than the declared Post type — read it untyped.
            const data = res.data.data as any;

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
                images: (data.images ?? []).map(
                    (img: { imageUrl: string }) => img.imageUrl,
                ),
                author: data.author,
                publishDate: data.publishDate,
                likedByMe: data.likedByMe,
                scope:data.scope
            } as Post;
        },
        enabled: !!postId,
    });
}

export default usePostDetail;
