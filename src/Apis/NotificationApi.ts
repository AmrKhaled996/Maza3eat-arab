import { axiosInstance } from "./axiosInstance";
import type {
  Notification,
  NotificationType,
} from "../Types/Notification";

// ─── Raw backend shapes ───────────────────────────────────────────────────────

interface BackendActor {
  id: string;
  name: string;
  avatar: string;
  tier: { id: string; name: string; badgeColor: string };
}

interface BackendNotification {
  id: string;
  type: NotificationType;
  isRead: boolean;
  lastActivityAt: string;
  numberOfActors: number;
  lastActor: BackendActor | null;
}

interface NotificationListResponse {
  status: string;
  data: {
    notifications: BackendNotification[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

interface UnreadCountResponse {
  status: string;
  data: { count: number; isCapped: boolean };
}

interface NotificationDetailResponse {
  status: string;
  data: Record<string, unknown>;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

/** Converts the backend notification shape to the frontend Notification type */
function mapNotification(n: BackendNotification): Notification {
  return {
    id: n.id,
    type: n.type,
    isRead: n.isRead,
    createdAt: n.lastActivityAt,
    aggregatorCount: n.numberOfActors,
    sender: n.lastActor
      ? {
          id: n.lastActor.id,
          name: n.lastActor.name,
          avatar: n.lastActor.avatar,
          tier: {
            name: n.lastActor.tier.name,
            badgeColor: n.lastActor.tier.badgeColor,
          },
        }
      : undefined,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of notifications for the current user.
 * Requires auth cookie (handled by axiosInstance).
 */
export async function fetchNotifications(cursor: string | null = null): Promise<{
  notifications: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;

  const { data } = await axiosInstance.get<NotificationListResponse>(
    "/notifications",
    { params }
  );

  return {
    notifications: data.data.notifications.map(mapNotification),
    nextCursor: data.data.nextCursor,
    hasMore: data.data.hasMore,
  };
}

/**
 * Fetch the unread notification + contact-request count for the current user.
 * Returns { count, isCapped } where count is capped at 99.
 */
export async function fetchUnreadCount(): Promise<{
  count: number;
  isCapped: boolean;
}> {
  const { data } = await axiosInstance.get<UnreadCountResponse>(
    "/notifications/unread-count"
  );
  return data.data;
}

/**
 * Fetch a single notification by id and mark it as read server-side.
 * Returns raw backend data (shape varies by notification type).
 */
export async function fetchNotificationById(
  id: string
): Promise<Record<string, unknown> | null> {
  try {
    const { data } =
      await axiosInstance.get<NotificationDetailResponse>(
        `/notifications/${id}`
      );
    return data.data;
  } catch {
    return null;
  }
}
