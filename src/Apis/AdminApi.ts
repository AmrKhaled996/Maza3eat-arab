import { axiosInstance } from "./axiosInstance";

export const getAdminUsers = async (status: "active" | "banned", cursor?: string | null) => {
  const { data } = await axiosInstance.get(`/admin/users`, {
    params: { status, cursor },
  });
  return data.data; // { users: User[], nextCursor: string, hasMore: boolean }
};

export const banUser = async (userId: string, reason: string) => {
  const { data } = await axiosInstance.patch(`/admin/users/${userId}/ban`, { reason });
  return data.data;
};

export const unbanUser = async (userId: string) => {
  const { data } = await axiosInstance.patch(`/admin/users/${userId}/unban`);
  return data.data;
};

export const updateUserTier = async (userId: string, tierId: number) => {
  const { data } = await axiosInstance.patch(`/admin/users/${userId}/tier`, { tierId });
  return data.data;
};

export const getAdminPosts = async (status: "PENDING" | "APPROVED", cursor?: string | null) => {
  const { data } = await axiosInstance.get(`/admin/posts`, {
    params: { status: status.toLowerCase(), cursor },
  });
  return data.data;
};

export const updatePostStatus = async (postId: string, status: "APPROVED" | "REJECTED", rejectionReason?: string) => {
  const action = status === "APPROVED" ? "approve" : "reject";
  const { data } = await axiosInstance.patch(`/admin/posts/${postId}`, { action, reason: rejectionReason });
  return data.data;
};

export const deletePost = async (postId: string) => {
  const { data } = await axiosInstance.delete(`/admin/posts/${postId}`);
  return data.data;
};

export const getAdminQuestions = async (status: "PENDING" | "APPROVED", cursor?: string | null) => {
  const { data } = await axiosInstance.get(`/admin/questions`, {
    params: { status: status.toLowerCase(), cursor },
  });
  return data.data;
};

export const updateQuestionStatus = async (questionId: string, status: "APPROVED" | "REJECTED", rejectionReason?: string) => {
  const action = status === "APPROVED" ? "approve" : "reject";
  const { data } = await axiosInstance.patch(`/admin/questions/${questionId}`, { action, reason: rejectionReason });
  return data.data;
};

export const deleteQuestion = async (questionId: string) => {
  const { data } = await axiosInstance.delete(`/admin/questions/${questionId}`);
  return data.data;
};

export const getAdminReports = async (status: "PENDING" | "RESOLVED" | "REJECTED", cursor?: string | null) => {
  const { data } = await axiosInstance.get(`/admin/reports`, {
    params: { status, cursor },
  });
  return data.data;
};

export const updateReportStatus = async (reportId: string, status: "RESOLVED" | "REJECTED") => {
  // Backend handles both resolve and reject by deleting the report
  const { data } = await axiosInstance.delete(`/admin/reports/${reportId}`);
  return data?.data;
};

export const getAdminTiers = async () => {
  const { data } = await axiosInstance.get(`/admin/tiers`);
  return data.data;
};

export const updateTier = async (tierId: number, payload: { name: string; description: string; badgeColor: string }) => {
  const { data } = await axiosInstance.put(`/admin/tiers/${tierId}`, payload);
  return data.data;
};

export const getAdminAds = async () => {
  const { data } = await axiosInstance.get(`/admin/ads`);
  return data.data;
};

export const deleteAdminAd = async (adId: string) => {
  const { data } = await axiosInstance.delete(`/admin/ads/${adId}`);
  return data.data;
};

export const getHomeAds = async () => {
  const { data } = await axiosInstance.get(`/admin/ads/home`);
  return data.data;
};

export const deleteHomeAd = async (homeAdId: string) => {
  const { data } = await axiosInstance.delete(`/admin/ads/home/${homeAdId}`);
  return data.data;
};

// === NEW MISSING APIs ===

export const getAdminUserById = async (userId: string) => {
  const { data } = await axiosInstance.get(`/users/${userId}`); // Using the public user details route since admin doesn't have a separate one
  return data.data;
};

export const getAdminPostById = async (postId: string) => {
  const { data } = await axiosInstance.get(`/admin/posts/${postId}`);
  return data.data;
};

export const createAdminPost = async (formData: FormData) => {
  const { data } = await axiosInstance.post(`/admin/posts`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const getAdminQuestionById = async (questionId: string) => {
  const { data } = await axiosInstance.get(`/admin/questions/${questionId}`);
  return data.data;
};

export const createAdminQuestion = async (payload: { title: string; content: string; tags: string[] }) => {
  const { data } = await axiosInstance.post(`/admin/questions`, payload);
  return data.data;
};

export const getAdminReportById = async (reportId: string) => {
  const { data } = await axiosInstance.get(`/admin/reports/${reportId}`);
  return data.data;
};

export const getAdminAnnouncements = async (cursor?: string | null) => {
  // Backend endpoint is returning 500 due to unmigrated Prisma enum.
  // Mocking the response on the frontend so the page can load.
  // const { data } = await axiosInstance.get(`/admin/announcements`, { params: { cursor } });
  // return data.data;
  return {
    announcements: [
      {
        id: "mock-1",
        title: "Welcome to Maza3eat Admin",
        content: "This is a mocked announcement since the backend is currently returning a 500 error due to Prisma schema mismatch.",
        type: "INFO",
        createdAt: new Date().toISOString(),
      }
    ],
    nextCursor: null,
    hasMore: false
  };
};

export const createAdminAnnouncement = async (payload: { title: string; content: string; type: "OFFICIAL" | "URGENT" | "INFO" }) => {
  // Backend endpoint is returning 500 due to unmigrated Prisma enum.
  // Mocking the response on the frontend.
  // const { data } = await axiosInstance.post(`/admin/announcements`, payload);
  // return data.data;
  return {
    id: "mock-" + Date.now(),
    ...payload,
    createdAt: new Date().toISOString()
  };
};
