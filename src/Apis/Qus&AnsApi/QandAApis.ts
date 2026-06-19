import { axiosInstance } from "../axiosInstance";
import type { Question } from "../../Types/Question";

export interface AnswerAuthor {
  id: string;
  name: string;
  avatar: string;
  tierName: string;
  badgeColor: string;
}

export interface ReplyItem {
  id: string;
  content: string;
  likesCount: number;
  depth: number;
  path: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    tierName: string;
    badgeColor: string;
  };
  createdAt: string;
  likedByMe?: boolean;
}

export interface AnswerItem {
  id: string;
  content: string;
  totalVoteValue: number;
  repliesCount: number;
  author: AnswerAuthor;
  createdAt: string;
  votedByMe?: number; // 1 or -1 or undefined
}

export async function createQuestion(title: string, content: string, tags: string[]) {
  const response = await axiosInstance.post<{ status: string; data: { id: string } }>("/questions", {
    title,
    content,
    tags,
  });
  return response.data;
}

export async function getQuestionById(questionId: string) {
  const response = await axiosInstance.get<{ status: string; data: Question & { likedByMe?: boolean } }>(
    `/questions/${questionId}`
  );
  return response.data.data;
}

export async function deleteQuestion(questionId: string) {
  const response = await axiosInstance.delete<{ status: string }>(`/questions/${questionId}`);
  return response.data;
}

export async function likeQuestion(questionId: string) {
  const response = await axiosInstance.post<{ status: string }>(`/questions/${questionId}/like`);
  return response.data;
}

export async function unlikeQuestion(questionId: string) {
  const response = await axiosInstance.delete<{ status: string }>(`/questions/${questionId}/like`);
  return response.data;
}

export async function getAnswers(questionId: string) {
  const response = await axiosInstance.get<{
    status: string;
    data: {
      answers: Array<{
        id: string;
        content: string;
        totalVoteValue: number;
        repliesCount: number;
        myVote: number;
        createdAt: string;
        author: {
          id: string;
          name: string;
          avatar: string;
          tier?: {
            name: string;
            badgeColor: string;
          } | null;
        };
      }>;
    };
  }>(`/questions/${questionId}/answers`);

  return response.data.data.answers.map(ans => ({
    id: ans.id,
    content: ans.content,
    totalVoteValue: ans.totalVoteValue,
    repliesCount: ans.repliesCount,
    createdAt: ans.createdAt,
    votedByMe: ans.myVote !== 0 ? ans.myVote : undefined,
    author: {
      id: ans.author.id,
      name: ans.author.name,
      avatar: ans.author.avatar,
      tierName: ans.author.tier?.name || "",
      badgeColor: ans.author.tier?.badgeColor || "",
    }
  })) as AnswerItem[];
}

export async function createAnswer(questionId: string, content: string) {
  const response = await axiosInstance.post<{
    status: string;
    data: {
      id: string;
      content: string;
      totalVoteValue: number;
      repliesCount: number;
      createdAt: string;
      author: {
        id: string;
        name: string;
        avatar: string;
        tier?: {
          name: string;
          badgeColor: string;
        } | null;
      };
    };
  }>(`/questions/${questionId}/answers`, { content });

  const ans = response.data.data;
  return {
    id: ans.id,
    content: ans.content,
    totalVoteValue: ans.totalVoteValue || 0,
    repliesCount: ans.repliesCount || 0,
    createdAt: ans.createdAt,
    votedByMe: undefined,
    author: {
      id: ans.author.id,
      name: ans.author.name,
      avatar: ans.author.avatar,
      tierName: ans.author.tier?.name || "",
      badgeColor: ans.author.tier?.badgeColor || "",
    }
  } as AnswerItem;
}

export async function voteAnswer(answerId: string, value: number) {
  const response = await axiosInstance.post<{ status: string }>(
    `/answers/${answerId}/vote`,
    { value }
  );
  return response.data;
}

export async function getReplies(answerId: string) {
  const response = await axiosInstance.get<{
    status: string;
    data: {
      replies: Array<{
        id: string;
        content: string;
        likesCount: number;
        depth: number;
        path: string;
        createdAt: string;
        likedByMe: boolean;
        author: {
          id: string;
          name: string;
          avatar: string;
          tier?: {
            name: string;
            badgeColor: string;
          } | null;
        };
      }>;
    };
  }>(`/answers/${answerId}/replies`);

  return response.data.data.replies.map(rep => ({
    id: rep.id,
    content: rep.content,
    likesCount: rep.likesCount,
    depth: rep.depth,
    path: rep.path,
    createdAt: rep.createdAt,
    likedByMe: rep.likedByMe,
    author: {
      id: rep.author.id,
      name: rep.author.name,
      avatar: rep.author.avatar,
      tierName: rep.author.tier?.name || "",
      badgeColor: rep.author.tier?.badgeColor || "",
    }
  })) as ReplyItem[];
}

export async function createReply(answerId: string, content: string) {
  const response = await axiosInstance.post<{
    status: string;
    data: {
      id: string;
      content: string;
      likesCount: number;
      depth: number;
      path: string;
      createdAt: string;
      author: {
        id: string;
        name: string;
        avatar: string;
        tier?: {
          name: string;
          badgeColor: string;
        } | null;
      };
    };
  }>(`/answers/${answerId}/replies`, { content });

  const rep = response.data.data;
  return {
    id: rep.id,
    content: rep.content,
    likesCount: rep.likesCount || 0,
    depth: rep.depth,
    path: rep.path,
    createdAt: rep.createdAt,
    likedByMe: false,
    author: {
      id: rep.author.id,
      name: rep.author.name,
      avatar: rep.author.avatar,
      tierName: rep.author.tier?.name || "",
      badgeColor: rep.author.tier?.badgeColor || "",
    }
  } as ReplyItem;
}

export async function createReplyToReply(replyId: string, content: string) {
  const response = await axiosInstance.post<{
    status: string;
    data: {
      id: string;
      content: string;
      likesCount: number;
      depth: number;
      path: string;
      createdAt: string;
      author: {
        id: string;
        name: string;
        avatar: string;
        tier?: {
          name: string;
          badgeColor: string;
        } | null;
      };
    };
  }>(`/answer-replies/${replyId}/replies`, { content });

  const rep = response.data.data;
  return {
    id: rep.id,
    content: rep.content,
    likesCount: rep.likesCount || 0,
    depth: rep.depth,
    path: rep.path,
    createdAt: rep.createdAt,
    likedByMe: false,
    author: {
      id: rep.author.id,
      name: rep.author.name,
      avatar: rep.author.avatar,
      tierName: rep.author.tier?.name || "",
      badgeColor: rep.author.tier?.badgeColor || "",
    }
  } as ReplyItem;
}

export async function getRepliesToReply(replyId: string) {
  const response = await axiosInstance.get<{
    status: string;
    data: {
      replies: Array<{
        id: string;
        content: string;
        likesCount: number;
        depth: number;
        path: string;
        createdAt: string;
        likedByMe: boolean;
        author: {
          id: string;
          name: string;
          avatar: string;
          tier?: {
            name: string;
            badgeColor: string;
          } | null;
        };
      }>;
    };
  }>(`/answer-replies/${replyId}/replies`);

  return response.data.data.replies.map(rep => ({
    id: rep.id,
    content: rep.content,
    likesCount: rep.likesCount,
    depth: rep.depth,
    path: rep.path,
    createdAt: rep.createdAt,
    likedByMe: rep.likedByMe,
    author: {
      id: rep.author.id,
      name: rep.author.name,
      avatar: rep.author.avatar,
      tierName: rep.author.tier?.name || "",
      badgeColor: rep.author.tier?.badgeColor || "",
    }
  })) as ReplyItem[];
}

export async function likeReply(replyId: string) {
  const response = await axiosInstance.post<{ status: string }>(`/answer-replies/${replyId}/like`);
  return response.data;
}

export async function unlikeReply(replyId: string) {
  const response = await axiosInstance.delete<{ status: string }>(`/answer-replies/${replyId}/like`);
  return response.data;
}
