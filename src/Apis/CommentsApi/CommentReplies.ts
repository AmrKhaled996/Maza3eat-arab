import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function createReplyToComment(content: string, commentId: string) {
  try {
    return axiosInstance.post(`/comments/${commentId}/replies`, { content });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error create reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function createReplyToReply(content: string, replyId: string) {
  try {
    return axiosInstance.post(`/replies/${replyId}/replies`, { content });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error create reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

// export async function getReplyReplies(replyId: string) {
//   return axiosInstance.get(`/replies/${replyId}/replies`);
// }

export async function getReplyRepliesWithCursor(
  replyId: string,
  cursor: string,
) {
  try {
    const response = await axiosInstance.get(`/replies/${replyId}/replies`, {
      params: { cursor: cursor },
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching replies to reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function getReplyReplies(replyId: string) {
  try {
    const response = await axiosInstance.get(`/replies/${replyId}/replies`);

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching replies to reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function likeToReply(replyId: string) {
  try {
    return axiosInstance.post(`/replies/${replyId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error like to reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function UnlikeToReply(replyId: string) {
  try {
    return axiosInstance.delete(`/replies/${replyId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error unlike to reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
