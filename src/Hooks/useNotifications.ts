import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Notification, ContactRequest, ContactRequestStatus } from "../Types/Notification";

const LOCAL_STORAGE_NOTIFS_KEY = "maza3eat_notifications";
const LOCAL_STORAGE_CONTACTS_KEY = "maza3eat_contact_requests";

// Mock data representing the mockup image exactly
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_announce_1",
    type: "ADMIN_ANNOUNCE",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 1000).toISOString(), // 30s ago
    title: "تحديثات هامة بخصوص شروط السفر الجديدة للموسم الحالي",
    body: `
# تفاصيل التحديثات الهامة للمسافرين

نود إعلام جميع أعضاء مجتمع **مزاعيط العرب** بأنه قد تم تحديث الإجراءات والوثائق المطلوبة للسفر بين الدول العربية للموسم السياحي الحالي. يرجى مراجعة النقاط التالية بدقة لضمان رحلة سلسة وخالية من العوائق:

## 1. التأشيرات الإلكترونية
قامت العديد من الدول العربية بتفعيل نظام التأشيرة الإلكترونية المسبقة (e-Visa) لتبسيط الدخول. تأكد من تقديم طلبك قبل 7 أيام عمل على الأقل من موعد المغادرة.

## 2. وثائق التأمين الصحي للسفر
أصبح التأمين الصحي الشامل الذي يغطي حالات الطوارئ الطبية متطلباً إجبارياً في بعض الوجهات. يرجى الاحتفاظ بنسخة مطبوعة من وثيقة التأمين دائماً أثناء السفر.

## 3. صلاحية جواز السفر
يجب ألا تقل صلاحية جواز السفر عن **6 أشهر** من تاريخ دخول الدولة المستهدفة.

---
> [!IMPORTANT]
> يرجى التأكد من تحديث بيانات حسابك الشخصي وربطه برقم هاتف مفعل لتلقي إشعارات الطوارئ بشكل فوري عبر الرسائل القصيرة.

نشكركم على كونكم جزءاً فعالاً من مجتمعنا!
    `,
    resourceId: "admin_announce_1",
  },
  {
    id: "notif_question_like_1",
    type: "QUESTION_LIKE",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    sender: {
      id: "user_ali_magdy",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    aggregatorCount: 29,
    resourceId: "q1",
  },
  {
    id: "notif_post_like_1",
    type: "POST_LIKE",
    isRead: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15m ago
    sender: {
      id: "user_ali_magdy",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    aggregatorCount: 29,
    resourceId: "p1",
  },
  {
    id: "notif_answer_1",
    type: "ANSWER",
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h ago
    sender: {
      id: "user_ali_magdy",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    aggregatorCount: 33,
    resourceId: "q1",
  },
  {
    id: "notif_comment_1",
    type: "COMMENT",
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h ago
    sender: {
      id: "user_ali_magdy",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    aggregatorCount: 73,
    resourceId: "p1",
  },
  {
    id: "notif_post_approve_1",
    type: "POST_APPROVE",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3h ago
    resourceId: "p1",
  },
  {
    id: "notif_comment_reply_1",
    type: "COMMENT_REPLY",
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    sender: {
      id: "user_sarah_j",
      name: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    resourceId: "p1",
  },
  {
    id: "notif_comment_reply_reply_1",
    type: "COMMENT_REPLY", // will display "replied to your reply" in component based on conditional context or type
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    sender: {
      id: "user_sarah_j",
      name: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    resourceId: "p1",
    // Custom flag or title to distinguish replied to your reply
    title: "REPLY_TO_REPLY",
  },
  {
    id: "notif_answer_reply_1",
    type: "ANSWER_REPLY",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    sender: {
      id: "user_mike_ross",
      name: "Mike Ross",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
      tier: {
        name: "gold",
        badgeColor: "#FFD700",
      },
    },
    resourceId: "q1",
  },
  {
    id: "notif_question_approve_1",
    type: "QUESTION_APPROVE",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    resourceId: "q1",
  },
];

const INITIAL_CONTACT_REQUESTS: ContactRequest[] = [
  {
    id: "req_1",
    direction: "RECEIVED",
    status: "PENDING",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    reason: "مرحباً بك! قرأت منشورك الرائع عن تنظيم الرحلات البرية في المغرب، وأود الاستفسار والتواصل معك لمساعدتي في التخطيط لرحلتي القادمة في أكتوبر. شكراً لك!",
    user: {
      id: "user_ali_magdy",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      tier: {
        name: "copper",
        badgeColor: "#B87333",
      },
    },
  },
  {
    id: "req_2",
    direction: "RECEIVED",
    status: "PENDING",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    reason: "Hello! I am planning a photography project in Dubai and love your desert photos. Can we connect to talk about location permissions?",
    user: {
      id: "user_ali_co_m",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
      tier: {
        name: "silver",
        badgeColor: "#C0C0C0",
      },
    },
  },
  {
    id: "req_3",
    direction: "SENT",
    status: "ACCEPTED",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    contactInfo: {
      phone: "+201234567890",
      email: "ali.magdy@example.com",
      whatsapp: "https://wa.me/201234567890",
    },
    user: {
      id: "user_ali_magdy",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      tier: {
        name: "copper",
        badgeColor: "#B87333",
      },
    },
  },
  {
    id: "req_4",
    direction: "SENT",
    status: "ACCEPTED",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2m ago
    contactInfo: {
      phone: "+201098765432",
      email: "ali.m.co@example.com",
      whatsapp: "https://wa.me/201098765432",
    },
    user: {
      id: "user_ali_co_m",
      name: "Ali Magdy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
      tier: {
        name: "silver",
        badgeColor: "#C0C0C0",
      },
    },
  },
];

// Helper functions for LocalStorage persistence
function getStoredNotifications(): Notification[] {
  const data = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(data);
}

function getStoredContactRequests(): ContactRequest[] {
  const data = localStorage.getItem(LOCAL_STORAGE_CONTACTS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(INITIAL_CONTACT_REQUESTS));
    return INITIAL_CONTACT_REQUESTS;
  }
  return JSON.parse(data);
}

function saveStoredNotifications(notifs: Notification[]) {
  localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifs));
}

function saveStoredContactRequests(reqs: ContactRequest[]) {
  localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(reqs));
}

export function useNotifications() {
  const queryClient = useQueryClient();

  // Query: Get Notifications list
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getStoredNotifications();
    },
  });

  // Query: Get Contact Requests list
  const contactRequestsQuery = useQuery({
    queryKey: ["contactRequests"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return getStoredContactRequests();
    },
  });

  // Mutation: Mark a single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const list = getStoredNotifications();
      const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      saveStoredNotifications(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], data);
    },
  });

  // Mutation: Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const list = getStoredNotifications();
      const updated = list.map((n) => ({ ...n, isRead: true }));
      saveStoredNotifications(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], data);
    },
  });

  // Mutation: Accept or decline a received contact request
  const respondToContactRequestMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: ContactRequestStatus }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const list = getStoredContactRequests();
      const updated = list.map((r) => {
        if (r.id === id) {
          const updatedReq = { ...r, status: action };
          if (action === "ACCEPTED") {
            updatedReq.contactInfo = {
              phone: r.contactInfo?.phone || "+201234567890",
              email: r.contactInfo?.email || `${r.user.name.toLowerCase().replace(" ", ".")}@example.com`,
              whatsapp: r.contactInfo?.whatsapp || "https://wa.me/201234567890",
            };
          }
          return updatedReq;
        }
        return r;
      });
      saveStoredContactRequests(updated);
      return updated;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["contactRequests"], data);
    },
  });

  // Reset helper for easy debugging / empty state testing
  const clearAllStateMutation = useMutation({
    mutationFn: async () => {
      saveStoredNotifications([]);
      saveStoredContactRequests([]);
      return { notifications: [], contactRequests: [] };
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], []);
      queryClient.setQueryData(["contactRequests"], []);
    },
  });

  const resetAllStateMutation = useMutation({
    mutationFn: async () => {
      saveStoredNotifications(INITIAL_NOTIFICATIONS);
      saveStoredContactRequests(INITIAL_CONTACT_REQUESTS);
      return { notifications: INITIAL_NOTIFICATIONS, contactRequests: INITIAL_CONTACT_REQUESTS };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], data.notifications);
      queryClient.setQueryData(["contactRequests"], data.contactRequests);
    },
  });

  const unreadCount = (notificationsQuery.data || []).filter((n) => !n.isRead).length;

  return {
    notifications: notificationsQuery.data || [],
    contactRequests: contactRequestsQuery.data || [],
    isLoading: notificationsQuery.isLoading || contactRequestsQuery.isLoading,
    isError: notificationsQuery.isError || contactRequestsQuery.isError,
    unreadCount,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    respondToContactRequest: respondToContactRequestMutation.mutateAsync,
    clearAllState: clearAllStateMutation.mutateAsync,
    resetAllState: resetAllStateMutation.mutateAsync,
  };
}
