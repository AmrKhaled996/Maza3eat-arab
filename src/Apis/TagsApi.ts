import { axiosInstance } from "./axiosInstance";

export interface TagItem {
  id?: string;
  name: string;
  postsCount?: number;
}

/**
 * Fetch suggested tags matching search query.
 */
export async function getSuggestedTags(search: string): Promise<TagItem[]> {
  if (!search.trim()) return [];
  const { data } = await axiosInstance.get("/tags/suggest", {
    params: { search: search.trim() },
  });
  return data.data || [];
}

/**
 * Fetch top trending tags.
 */
export async function getTrendingTags(limit = 10): Promise<TagItem[]> {
  const { data } = await axiosInstance.get("/tags/trending", {
    params: { limit },
  });
  return data.data || [];
}
