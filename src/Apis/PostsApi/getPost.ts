import { axiosInstance } from "../axiosInstance";
import type { Post } from "../../Types/Post";

export type GetPostResponse = {
  status: string;
  data: Post;
};

export async function getPostById(postId: string) {
  return axiosInstance.get<GetPostResponse>(`/posts/${postId}`);
}
