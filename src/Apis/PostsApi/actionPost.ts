import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function likeToPost(postId: string) {
  try {
    return axiosInstance.post(`/posts/${postId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error like to post:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function unlikeToPost(postId: string) {
  try {
    return axiosInstance.delete(`/posts/${postId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error unlike to post:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
