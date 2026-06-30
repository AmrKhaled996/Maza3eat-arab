import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function createComment(content: string, postId: string) {
  try {
    return axiosInstance.post(`/posts/${postId}/comments`, { content });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error create comment:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function getCommentsByPostIdWithCursor(
  postId: string,
  cursor: string,
) {
  try {
    const response = await axiosInstance.get(
      `/posts/${postId}/comments?&cursor=${cursor}`,
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching comments to post:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function getCommentsByPostId(postId: string) {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/comments`);

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching comments to post:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function getCommentRepliesWithCursor(
  commentId: string,
  cursor: string,
) {
  try {
    const response = await axiosInstance.get(
      `/comments/${commentId}/replies`,{params:{cursor:cursor}}
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching comment replies:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function getCommentReplies(commentId: string) {
  try {
    const response = await axiosInstance.get(`/comments/${commentId}/replies`);

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching comment replies:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function likeToComment( commentId: string) {
  try {
    return axiosInstance.post(`/comments/${commentId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error like to comment:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function UnlikeToComment( commentId: string) {
  try {
    return axiosInstance.delete(`/comments/${commentId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error unlike to comment:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

