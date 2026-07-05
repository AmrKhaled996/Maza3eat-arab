import type { Reply } from "./Reply";

export interface Tier {
  id: number;
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

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  totalVoteValue: number;
  repliesCount: number;
  createdAt: Date;
  author: Author;
  myVote: -1 | 0 | 1;
  permissions: Permissions;
  replies?: Reply[]
}