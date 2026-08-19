import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function createReplyToAnswer(content: string, answerId: string) {
  try {
    return axiosInstance.post(`/answers/${answerId}/replies`, { content });
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
    return axiosInstance.post(`/answer-replies/${replyId}/replies`, {
      content,
    });
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
//   return axiosInstance.get(`/answer-replies/${replyId}/replies`);
// }

export async function getReplyRepliesWithCursor(
  replyId: string,
  cursor: string,
  excludeReplyId: string = "",
) {
  try {
    const response = await axiosInstance.get(
      `/answer-replies/${replyId}/replies`,
      {
        params:excludeReplyId ? { cursor: cursor, excludeReplyId: excludeReplyId } : { cursor: cursor },
      },
    );

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
export async function getReplyReplies(replyId: string, excludeReplyId: string = "") {
  try {
    const response = await axiosInstance.get(
      `/answer-replies/${replyId}/replies`,{
        params:excludeReplyId ? { excludeReplyId: excludeReplyId } : {},
      }
    );

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
export async function deleteReply(replyId: string) {
  try {
    return axiosInstance.delete(`/answer-replies/${replyId}`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error delete reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function reportReply(replyId: string, reason: string) {
  try {
    return axiosInstance.post(`/reports/`, {
      targetId: replyId,
      targetType: "ANSWER_REPLY",
      reason: reason,
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

export async function likeToReply(replyId: string) {
  try {
    return axiosInstance.post(`/answer-replies/${replyId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error like to reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function unlikeToReply(replyId: string) {
  try {
    return axiosInstance.delete(`/answer-replies/${replyId}/like`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error unlike to reply:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
