import type { Reply } from "./Reply";


export interface Comment {
  id: string;
  postId: string;
  content: string;
  likesCount: number;
  repliesCount: number;
  createdAt: Date;
  author: Author;
  likedByMe: boolean;
  permissions: Permissions,
  replies?: Reply[];
}

export interface Tier {
  id: string|number;
  name: string;
  badgeColor: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  tier: Tier;
}

export interface Permissions {
  canDelete: boolean;
  canReport: boolean;
}