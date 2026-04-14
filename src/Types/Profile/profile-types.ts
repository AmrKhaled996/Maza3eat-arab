import type { Tag } from "../Tag";

export interface userProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
export interface Tags {
  name: string;
}
export interface image {
  url: string;
  name: string;
  remainingImages: number;
}
export interface UserPost {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  publishDate: string;
  tags: Tags[];
  image: image;
  author:string,
}
export interface UserPostsResponse {
  posts: UserPost[];
  nextCursor: string | null;
  hasMore: boolean;
}
export interface UserQuestion {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  answersCount: number;
  publishDate: string;
  tags: Tag[];
  author:string,
}
export interface UserQuestionsResponse {
  posts: UserQuestion[];
  nextCursor: string | null;
  hasMore: boolean;
}