import type { AxiosError } from "axios";
import { axiosInstance } from "../axiosInstance";
import type {
  UserPostsResponse,
  userProfileData,
  UserQuestionsResponse,
} from "../../Types/Profile/profile-types";

export async function getUserProfile(): Promise<userProfileData> {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "Error fetching user Profile",
      axiosError.response?.data || axiosError.message,
    );
    throw error;
  }
}

// userposts
export async function getUserPosts({
  pageParam = null,
  userId,
}: {
  pageParam?: string | null | unknown;
  userId: string;
}): Promise<UserPostsResponse> {
  const response = await axiosInstance.get(`/users/${userId}/posts`, {
    params: {
      cursor: pageParam,
    },
  });

  return response.data.data;
}
// userQ
export async function getUserQuestions({
  pageParam = null,
  userId,
}: {
  pageParam?: string | null | unknown;
  userId: string;
}): Promise<UserQuestionsResponse> {
  const response = await axiosInstance.get(`/users/${userId}/questions`, {
    params: {
      cursor: pageParam,
    },
  });

  return response.data.data;
}
