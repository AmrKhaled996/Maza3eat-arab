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

export interface Reply {
  id: string;
  commentId: string;
  content: string;
  likesCount: number;
  depth: number;
  path: string;
  createdAt: Date;
  author: Author;
  hasReplies: boolean;
  likedByMe: boolean;
  permissions: Permissions;
  replies?: Reply[];
}