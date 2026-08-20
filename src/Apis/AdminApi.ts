import type { Post } from "../Types/Post";
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

export const getAdminPosts = async (statusTab?: "PENDING" | "APPROVED", cursor?: string | null, searchQuery?: string) => {
  const { data } = await axiosInstance.get(`/admin/posts`, {
    params: { status: statusTab?.toLowerCase(), cursor, search: searchQuery || undefined },
  });
  return data.data;
};

export const updatePostStatus = async (postId: string, _status: "APPROVED" | "REJECTED", rejectionReason?: string) => {
  const action = _status === "APPROVED" ? "approve" : "reject";
  const { data } = await axiosInstance.patch(`/admin/posts/${postId}`, { action, reason: rejectionReason });
  return data.data;
};

export const deletePost = async (postId: string) => {
  const { data } = await axiosInstance.delete(`/admin/posts/${postId}`);
  return data.data;
};

export const getAdminQuestions = async (status: "PENDING" | "APPROVED", cursor?: string | null,searchQuery?: string) => {
  const { data } = await axiosInstance.get(`/admin/questions`, {
    params: { status: status.toLowerCase(), cursor, search: searchQuery || undefined },
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

export const updateReportStatus = async (reportId: string, status: "BANNING" | "REJECTED",userId?:string) => {
   if(status === "BANNING" && userId)
    await banUser(userId, "تم حظر الحساب بسبب إرسال طلبات تواصل غير مرغوب فيها، مما تسبب في إزعاج المستخدمين ومخالفة سياسات المنصة المتعلقة بالاستخدام المزعج لخدمة التواصل.");
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

export const getAdminAds = async (cursor?: string | null) => {
  const { data } = await axiosInstance.get(`/admin/ads`, {
    params: cursor ? { cursor } : undefined,
  });
  return data.data;
};

export const createAdminAd = async (formData: FormData) => {
  const { data } = await axiosInstance.post(`/admin/ads`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateAdminAd = async (adId: string, formData: FormData) => {
  const { data } = await axiosInstance.put(`/admin/ads/${adId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

export const createHomeAd = async (adId: string, adPosition: "top" | "middle" | "bottom") => {
  const { data } = await axiosInstance.post(`/admin/ads/home`, { adId, adPosition });
  return data.data;
};

export const updateHomeAd = async (homeAdId: string, adId: string) => {
  const { data } = await axiosInstance.patch(`/admin/ads/home/${homeAdId}`, { adId });
  return data.data;
};

export const deleteHomeAd = async (homeAdId: string) => {
  const { data } = await axiosInstance.delete(`/admin/ads/home/${homeAdId}`);
  return data.data;
};

export const getModerators = async (cursor?: string | null) => {
  const { data } = await axiosInstance.get(`/admin/moderators`, { params: { cursor } });
  return data.data;
};

export const promoteToModerator = async (userId: string) => {
  const { data } = await axiosInstance.put(`/admin/moderators/${userId}`);
  return data.data;
};

export const demoteModerator = async (userId: string) => {
  const { data } = await axiosInstance.delete(`/admin/moderators/${userId}`);
  return data.data;
};

// === NEW MISSING APIs ===

export const getAdminUserById = async (userId: string) => {
  const { data } = await axiosInstance.get(`/users/${userId}`); // Using the public user details route since admin doesn't have a separate one
  return data.data;
};

export const getAdminPostById = async (postId: string) => {
  const { data:postsData } = await axiosInstance.get(`/admin/posts/${postId}`);
  const data = postsData.data as any;
   return {
                  id: postId,
                  title: data.title,
                  content: data.content,
                  likesCount: data.likesCount,
                  commentsCount: data.commentsCount,
                  tags: data.tags,
                  image: {
                      url: data.images?.[0]?.imageUrl || "",
                      name: data.images?.[0]?.originalName || "",
                      remainingImages: Math.max((data.images?.length || 1) - 1, 0),
                  },
                  images: (data.images ?? []).map(
                      (img: { imageUrl: string }) => img.imageUrl,
                  ),
                  author: data.author,
                  publishDate: data.publishDate,
                  likedByMe: data.likedByMe,
                  status: data.status
              } as Post;
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
  const { data } = await axiosInstance.get(`/admin/announcements`, { params: { cursor } });
  return data.data;
};

export const createAdminAnnouncement = async (message: string) => {
  const { data } = await axiosInstance.post(`/admin/announcements`, { message });
  return data.data;
};
