import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Notification,
  ContactRequest,
  ContactRequestStatus,
} from "../Types/Notification";
import {
  fetchNotifications,
  fetchUnreadCount,
  fetchNotificationById,
} from "../Apis/NotificationApi";
import {
  fetchContactRequests,
  respondToContactRequest as apiRespondToContactRequest,
} from "../Apis/ContactRequestApi";
import { useSocket } from "../Context/SocketContext";
import { axiosInstance } from "../Apis/axiosInstance";

// ─── Query keys ────────────────────────────────────────────────────────────────
const NOTIFICATIONS_KEY = ["notifications"];
const CONTACT_REQUESTS_KEY = ["contactRequests"];
const UNREAD_COUNT_KEY = ["unreadCount"];

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useNotifications() {
  const queryClient = useQueryClient();
  const { liveCount } = useSocket();

  // ── Queries ──────────────────────────────────────────────────────────────────

  /** All notifications for the current user (first page, cursor = null). */
  const notificationsQuery = useQuery<Notification[]>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async () => {
      const res = await fetchNotifications(null);
      return res.notifications;
    },
    staleTime: 0,
  });

  /** Contact requests visible to the current user (first page). */
  const contactRequestsQuery = useQuery<ContactRequest[]>({
    queryKey: CONTACT_REQUESTS_KEY,
    queryFn: async () => {
      const res = await fetchContactRequests(null);
      return res.contactRequests;
    },
    staleTime: 0,
  });

  /** Total unread count (notifications + unread contact requests). */
  const unreadCountQuery = useQuery<{ count: number; isCapped: boolean }>({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: fetchUnreadCount,
    // Fallback polling every 90 s — WebSocket updates take priority
    staleTime: 90_000,
    refetchInterval: 90_000,
  });

  // ── WebSocket: sync live count pushed by the backend ─────────────────────────
  useEffect(() => {
    if (liveCount === null) return;

    // Update the react-query cache immediately with the server-pushed count
    queryClient.setQueryData<{ count: number; isCapped: boolean }>(
      UNREAD_COUNT_KEY,
      liveCount
    );

    // Also trigger a refresh of the notification and contact-request lists
    // so the UI shows the newest items when the count goes up
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    queryClient.invalidateQueries({ queryKey: CONTACT_REQUESTS_KEY });
  }, [liveCount, queryClient]);

  // ── Mutations ─────────────────────────────────────────────────────────────────

  /**
   * Mark a single notification as read.
   * We hit the backend detail page (GET /notifications/:id) which handles the read flag
   * update in the database, and we update the local cache immediately.
   */
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetchNotificationById(id);
      return id;
    },
    onSuccess: (id) => {
      // Optimistic: flip isRead in the cached list
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? []
      );
      // Decrement unread count
      queryClient.setQueryData<{ count: number; isCapped: boolean }>(
        UNREAD_COUNT_KEY,
        (old) =>
          old
            ? { ...old, count: Math.max(0, old.count - 1) }
            : { count: 0, isCapped: false }
      );
    },
  });

  /**
   * Respond to a received contact request (ACCEPTED or DECLINED).
   * For ACCEPTED, supply contactMethod: { type, value }.
   */
  const respondToContactRequestMutation = useMutation({
    mutationFn: async ({
      id,
      action,
      contactMethod,
    }: {
      id: string;
      action: ContactRequestStatus;
      contactMethod?: { type: "PHONE" | "EMAIL" | "WHATSAPP"; value: string };
    }) => {
      await apiRespondToContactRequest(
        id,
        action as "ACCEPTED" | "DECLINED",
        contactMethod?.type,
        contactMethod?.value
      );
      return { id, action };
    },
    onSuccess: ({ id, action }) => {
      // Remove the responded request from the local list
      queryClient.setQueryData<ContactRequest[]>(
        CONTACT_REQUESTS_KEY,
        (old) => old?.filter((r) => r.id !== id) ?? []
      );
      if (action === "ACCEPTED" || action === "DECLINED") {
        queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
      }
    },
    onError: (err) => {
      console.error("Failed to respond to contact request:", err);
    },
  });

  // ── Derived values ────────────────────────────────────────────────────────────

  const unreadCount = unreadCountQuery.data?.count ?? 0;

  // ── Exposed API ───────────────────────────────────────────────────────────────

  return {
    notifications: notificationsQuery.data ?? [],
    contactRequests: contactRequestsQuery.data ?? [],
    isLoading:
      notificationsQuery.isLoading || contactRequestsQuery.isLoading,
    isError:
      notificationsQuery.isError || contactRequestsQuery.isError,
    unreadCount,

    /** Mark one notification as read (optimistic, detail fetch does the real mark). */
    markAsRead: (id: string) => markAsReadMutation.mutateAsync(id),

    /**
     * Accept or decline a received contact request.
     * Pass `contactMethod` when accepting so the backend can encrypt and store it.
     */
    respondToContactRequest: (args: {
      id: string;
      action: ContactRequestStatus;
      contactMethod?: { type: "PHONE" | "EMAIL" | "WHATSAPP"; value: string };
    }) => {
      const mappedMethod = args.contactMethod
        ? {
            type: args.contactMethod.type === "PHONE" ? ("WHATSAPP" as const) : args.contactMethod.type,
            value:
              args.contactMethod.type === "PHONE" || args.contactMethod.type === "WHATSAPP"
                ? args.contactMethod.value.trim().startsWith("+")
                  ? args.contactMethod.value.trim()
                  : `+${args.contactMethod.value.trim()}`
                : args.contactMethod.value,
          }
        : undefined;
      return respondToContactRequestMutation.mutateAsync({
        id: args.id,
        action: args.action,
        contactMethod: mappedMethod,
      });
    },

    /** Re-fetch both lists and the unread count from the server. */
    refetch: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: NOTIFICATIONS_KEY }),
        queryClient.refetchQueries({ queryKey: CONTACT_REQUESTS_KEY }),
        queryClient.refetchQueries({ queryKey: UNREAD_COUNT_KEY }),
      ]);
    },

    // ── Legacy sandbox helpers (kept so the page component still compiles) ──────
    /** @deprecated use refetch() */
    clearAllState: async () => {
      queryClient.setQueryData(NOTIFICATIONS_KEY, []);
      queryClient.setQueryData(CONTACT_REQUESTS_KEY, []);
    },
    /** @deprecated use refetch() */
    resetAllState: async () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: CONTACT_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  };
}
