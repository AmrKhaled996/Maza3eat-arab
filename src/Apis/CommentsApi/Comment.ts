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
  excludeCommentId?: string
) {
  try {
    const response = await axiosInstance.get(
      `/posts/${postId}/comments`,{
        params: { cursor: cursor , excludeCommentId: excludeCommentId },
      }
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

export async function getCommentsByPostId(postId: string ,excludeCommentId?: string) {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/comments`,{
      params: { excludeCommentId: excludeCommentId },
    });

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
    const response = await axiosInstance.get(`/comments/${commentId}/replies`, {
      params: { cursor: cursor },
    });

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

export async function deleteComment(postId: string, commentId: string) {
  try {
    return axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error delete comment:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function reportComment(commentId: string, reason: string) {
  try {
    return axiosInstance.post(`/reports/`, {
      targetId: commentId,
      targetType: "COMMENT",
      reason,
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error report comment:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function likeToComment(commentId: string) {
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
export async function unlikeToComment(commentId: string) {
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
