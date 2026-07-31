import { axiosInstance } from "./axiosInstance";

export interface UserProfileData {
  id: string;
  name: string;
  avatar: string;
  tier: {
    id: string;
    name: string;
    badgeColor: string;
    description?: string;
  };
  createdAt?: string;
  /** Backend returns `counts`, not `_count`. */
  counts?: {
    posts?: number;
    questions?: number;
  };
  permissions?: {
    canEditProfile?: boolean;
  };
}

export async function fetchUserProfile(userId: string): Promise<UserProfileData> {
  const { data } = await axiosInstance.get(`/users/${userId}`);
  return data.data;
}

export async function fetchUserPosts(userId: string, cursor?: string | null) {
  const { data } = await axiosInstance.get(`/users/${userId}/posts`, {
    params: { cursor },
  });
  return data.data;
}

export async function fetchUserQuestions(userId: string, cursor?: string | null) {
  const { data } = await axiosInstance.get(`/users/${userId}/questions`, {
    params: { cursor },
  });
  return data.data;
}
