import type { Answer } from "./Answer";
import type { Comment } from "./Comment";
import type { Reply, Tier } from "./Reply";

export type NotificationType =
  | "QUESTION_LIKE"
  | "POST_LIKE"
  | "ANSWER"
  | "COMMENT"
  | "COMMENT_REPLY"
  | "ANSWER_REPLY"
  | "COMMENT_REPLY_REPLY"
  | "ANSWER_REPLY_REPLY"
  | "POST_APPROVAL"
  | "QUESTION_APPROVAL"
  | "POST_REJECTION"
  | "QUESTION_REJECTION"
  | "TIER_UPGRADE"
  | "ADMIN_ANNOUNCEMENT";

export interface NotificationSender {
  id: string;
  name: string;
  avatar: string;
  tier: {
    name: string;
    description?: string;
    badgeColor: string;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  title?: string;
  body?: string;
  resourceId?: string;
  sender?: NotificationSender;
  aggregatorCount?: number;
  rejectionReason?: string;
  postId?: string;
  questionId?: string;
  parentReply?: Reply;
  comment?: Comment;
  answer?: Answer;
  reply?: Reply;
  newTier?:Tier;
  oldTier?:Tier;
}

export type ContactRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type ContactRequestDirection = "RECEIVED" | "SENT";

export interface ContactRequestInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
}

export interface ContactRequest {
  id: string;
  direction: ContactRequestDirection;
  status: ContactRequestStatus;
  reason?: string;
  createdAt: string;
  contactInfo?: ContactRequestInfo;
  user: NotificationSender;
}
