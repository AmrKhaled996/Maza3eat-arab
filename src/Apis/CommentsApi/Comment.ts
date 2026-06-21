import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";



export async function createComment(content:string, postId:string) {
    try {
        return axiosInstance.post(`/posts/${postId}/comments`, {content});
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
            console.error(
              "Error fetching home posts:",
              (axiosError.response?.data || axiosError.message)
            );
        
            throw error;
    }
}


export async function getCommentsByPostId(postId: string) {
  return axiosInstance.get(`/posts/${postId}/comments`);
}

export async function getCommentReplies(commentId: string) {
  return axiosInstance.get(`/comments/${commentId}/replies`);
}