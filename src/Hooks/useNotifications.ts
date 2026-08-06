import { useEffect } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useAuth } from "../Hooks/Auth";

const NOTIFICATIONS_KEY = ["notifications"];
const CONTACT_REQUESTS_KEY = ["contactRequests"];
const UNREAD_COUNT_KEY = ["unreadCount"];

export function useNotifications() {
  const queryClient = useQueryClient();
  const { liveCount } = useSocket();
  const { isAuthenticated } = useAuth();


  /** All notifications with infinite scroll pagination. */
  const notificationsQuery = useInfiniteQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async ({ pageParam }) => {
      return await fetchNotifications(pageParam as string | null);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 0,
    enabled: isAuthenticated,
  });

  /** Contact requests visible to the current user, with infinite scroll pagination. */
  const contactRequestsQuery = useInfiniteQuery({
    queryKey: CONTACT_REQUESTS_KEY,
    queryFn: async ({ pageParam }) => {
      return await fetchContactRequests(pageParam as string | null);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    staleTime: 0,
    enabled: isAuthenticated,
  });

  /** Total unread count (notifications + unread contact requests). */
  const unreadCountQuery = useQuery<{
    total: { count: number; isCapped: boolean };
    notifications: { count: number; isCapped: boolean };
    contactRequests: { count: number; isCapped: boolean };
  }>({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: fetchUnreadCount,
    // Fallback polling every 90 s — WebSocket updates take priority
    staleTime: 90_000,
    refetchInterval: 90_000,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (liveCount === null) return;

    // Update the react-query cache immediately with the server-pushed count
    queryClient.setQueryData<{
      total: { count: number; isCapped: boolean };
      notifications: { count: number; isCapped: boolean };
      contactRequests: { count: number; isCapped: boolean };
    }>(UNREAD_COUNT_KEY, liveCount);

    // Also trigger a refresh of the notification and contact-request lists
    // so the UI shows the newest items when the count goes up
    queryClient.refetchQueries({ queryKey: NOTIFICATIONS_KEY });
    queryClient.refetchQueries({ queryKey: CONTACT_REQUESTS_KEY });
  }, [liveCount, queryClient]);


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
    onSuccess: (id: string) => {
      const list = queryClient.getQueryData<{
        pages: { notifications: Notification[]; nextCursor: string | null; hasMore: boolean }[];
        pageParams: unknown[];
      }>(NOTIFICATIONS_KEY);
      const cached = list?.pages
        .flatMap((page) => page.notifications)
        .find((n) => n.id === id);

      // Already read (or unknown) — the server did not decrement, so neither should we
      if (cached?.isRead) return;

      // Flip the row in the list cache so it stops rendering as unread
      queryClient.setQueryData<{
        pages: { notifications: Notification[]; nextCursor: string | null; hasMore: boolean }[];
        pageParams: unknown[];
      }>(NOTIFICATIONS_KEY, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                notifications: page.notifications.map((n) =>
                  n.id === id ? { ...n, isRead: true } : n
                ),
              })),
            }
          : old
      );

      // Decrement unread count
      queryClient.setQueryData<{
        total: { count: number; isCapped: boolean };
        notifications: { count: number; isCapped: boolean };
        contactRequests: { count: number; isCapped: boolean };
      }>(UNREAD_COUNT_KEY, (old) =>
        old
          ? {
              ...old,
              total: { ...old.total, count: Math.max(0, old.total.count - 1) },
              notifications: { ...old.notifications, count: Math.max(0, old.notifications.count - 1) },
            }
          : {
              total: { count: 0, isCapped: false },
              notifications: { count: 0, isCapped: false },
              contactRequests: { count: 0, isCapped: false },
            }
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
      contactMethod?: { type: "FACEBOOK" | "WHATSAPP" | "INSTAGRAM" | "EMAIL"; value: string };
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
      // Remove the responded request from every cached page
      queryClient.setQueryData<{
        pages: { contactRequests: ContactRequest[]; nextCursor: string | null; hasMore: boolean }[];
        pageParams: unknown[];
      }>(CONTACT_REQUESTS_KEY, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                contactRequests: page.contactRequests.filter((r) => r.id !== id),
              })),
            }
          : old
      );
      if (action === "ACCEPTED" || action === "DECLINED") {
        queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
      }
    },
    onError: (err) => {
      console.error("Failed to respond to contact request:", err);
    },
  });


  const unreadCount = unreadCountQuery.data ?? {
    total: { count: 0, isCapped: false },
    notifications: { count: 0, isCapped: false },
    contactRequests: { count: 0, isCapped: false },
  };

  // Flatten all pages of notifications into a single array
  const allNotifications: Notification[] = notificationsQuery.data?.pages.flatMap(
    (page) => page.notifications
  ) ?? [];


  const allContactRequests: ContactRequest[] =
    contactRequestsQuery.data?.pages.flatMap((page) => page.contactRequests) ?? [];

  return {
    notifications: allNotifications,
    contactRequests: allContactRequests,
    isLoading:
      notificationsQuery.isLoading || contactRequestsQuery.isLoading,
    isError:
      notificationsQuery.isError || contactRequestsQuery.isError,
    unreadCount,

    // Infinite scroll for notifications
    fetchNextPage: notificationsQuery.fetchNextPage,
    hasNextPage: notificationsQuery.hasNextPage,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,

    // Infinite scroll for contact requests
    fetchNextContactPage: contactRequestsQuery.fetchNextPage,
    hasNextContactPage: contactRequestsQuery.hasNextPage,
    isFetchingNextContactPage: contactRequestsQuery.isFetchingNextPage,

    /** Mark one notification as read (optimistic, detail fetch does the real mark). */
    markAsRead: (id: string) => markAsReadMutation.mutateAsync(id),

    /**
     * Accept or decline a received contact request.
     * Pass `contactMethod` when accepting so the backend can encrypt and store it.
     */
    respondToContactRequest: (args: {
      id: string;
      action: ContactRequestStatus;
      contactMethod?: { type: "FACEBOOK" | "WHATSAPP" | "INSTAGRAM" | "EMAIL"; value: string };
    }) => {
      const mappedMethod = args.contactMethod
        ? {
            type: args.contactMethod.type,
            value: args.contactMethod.value,
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
      queryClient.setQueryData(NOTIFICATIONS_KEY, { pages: [], pageParams: [] });
      queryClient.setQueryData(CONTACT_REQUESTS_KEY, { pages: [], pageParams: [] });
    },
    /** @deprecated use refetch() */
    resetAllState: async () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: CONTACT_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  };
}
