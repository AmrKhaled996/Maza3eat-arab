import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";

export async function createAnswers(content: string, questionId: string) {
  try {
    return axiosInstance.post(`/questions/${questionId}/answers`, { content });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error create answer:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function getAnswersByQuestionIdWithCursor(
  questionId: string,
  cursor: string,
) {
  try {
    const response = await axiosInstance.get(
      `/questions/${questionId}/answers?&cursor=${cursor}`,
    );

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching answers to post:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function getAnswersByQuestionId(questionId: string) {
  try {
    const response = await axiosInstance.get(`/questions/${questionId}/answers`);

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching answers to post:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function getAnswerRepliesWithCursor(
  answersId: string,
  cursor: string,
) {
  try {
    const response = await axiosInstance.get(`/answers/${answersId}/replies`, {
      params: { cursor: cursor },
    });

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching answer replies:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function getAnswerReplies(answersId: string) {
  try {
    const response = await axiosInstance.get(`/answers/${answersId}/replies`);

    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching answer replies:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function deleteAnswers(questionId: string, answersId: string) {
  try {
    return axiosInstance.delete(`/questions/${questionId}/answers/${answersId}`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error delete answer:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function reportAnswers(answersId: string, reason: string) {
  try {
    return axiosInstance.post(`/reports/`, {
      targetId: answersId,
      targetType: "ANSWER",
      reason,
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error report answer:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}

export async function answerUpVote(answersId: string) {
  try {
    return axiosInstance.post(`/answers/${answersId}/vote`, { value: 1 });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error like to answer:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
export async function answerDownVote(answersId: string) {
  try {
    return axiosInstance.post(`/answers/${answersId}/vote`, { value: -1 });
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error unlike to answer:",
      axiosError.response?.data || axiosError.message,
    );

    throw error;
  }
}
