export type NotificationType =
  | "QUESTION_LIKE"
  | "POST_LIKE"
  | "ANSWER"
  | "COMMENT"
  | "COMMENT_REPLY"
  | "ANSWER_REPLY"
  | "POST_APPROVE"
  | "QUESTION_APPROVE"
  | "ADMIN_ANNOUNCE";

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
}

export type ContactRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type ContactRequestDirection = "RECEIVED" | "SENT";

export interface ContactRequestInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
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
