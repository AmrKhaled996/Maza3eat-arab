import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function createReplyToComment(content:string, commentId:string) {
    try {
        return axiosInstance.post(`/comments/${commentId}/replies`, {content});
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
            console.error(
              "Error fetching home posts:",
              (axiosError.response?.data || axiosError.message)
            );
        
            throw error;
    }
}
export async function createReplyToReply(content:string, replyId:string) {
    try {
        return axiosInstance.post(`/replies/${replyId}/replies`, {content});
    } catch (error) {
        const axiosError = error as AxiosError<{message: string}>;
            console.error(
              "Error fetching home posts:",
              (axiosError.response?.data || axiosError.message)
            );
        
            throw error;
    }
}

export async function getReplyReplies(replyId: string) {
  return axiosInstance.get(`/replies/${replyId}/replies`);
}
