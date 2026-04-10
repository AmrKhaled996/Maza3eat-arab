import type { Author } from "./Author";
import type { Tag } from "./Tag";


export interface TopAnswerAuthor {
  name: string;
  avatar: string;
  tier: {
    name: string;
    badgeColor: string;
  };
}

export interface TopAnswer {
  id: string;
  content: string;
  totalVoteValue: number;
  author: TopAnswerAuthor;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  likesCount: number;
  answersCount: number;
  publishDate: Date;
  tags: Tag[];
  author: Author;
  topAnswer?: TopAnswer;
}

export interface QuestionsResponse {
  questions: Question[];
  hasMore: boolean;
  nextCursor: string | null;
}

