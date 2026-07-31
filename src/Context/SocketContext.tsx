import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./Auth";
import { playNotificationSound } from "../utils/sounds";

// ─── Socket event constants (mirroring backend SOCKET_EVENTS) ─────────────────
export const SOCKET_EVENTS = {
  NOTIFICATION_COUNT: "notification:count",
  FORCE_LOGOUT: "auth:force-logout",
  ANNOUNCEMENT_NOTIFICATION: "notification:announcement",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface NotificationCountPayload {
  total: { count: number; isCapped: boolean };
  notifications: { count: number; isCapped: boolean };
  contactRequests: { count: number; isCapped: boolean };
}

interface SocketContextType {
  /** Live notification count pushed by the backend over WebSocket. */
  liveCount: NotificationCountPayload | null;
  /** Whether the socket is currently connected. */
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  liveCount: null,
  isConnected: false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Manages a single Socket.IO connection for the authenticated user.
 * The socket uses httpOnly cookies for auth (same as the REST API).
 * Emits `notification:count` events that update `liveCount`.
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const liveCountRef = useRef<NotificationCountPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveCount, setLiveCount] = useState<NotificationCountPayload | null>(null);

  useEffect(() => {
    // Don't connect until auth state is settled and user is authenticated
    if (isLoading || !isAuthenticated) {
      // If we were connected and user logged out, disconnect
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsConnected(false);
        liveCountRef.current = null;
        setLiveCount(null);
      }
      return;
    }

    // Already connected — no-op
    if (socketRef.current?.connected) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
      ? // Strip the "/api/v1" path — Socket.IO connects at the root
        (import.meta.env.VITE_BACKEND_URL as string).replace(/\/api\/v1\/?$/, "")
      : "http://localhost:3000";

    const socket = io(backendUrl, {
      withCredentials: true, // sends httpOnly cookies for auth
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] Connection error:", err.message);
      setIsConnected(false);
    });

    // ── Listen for real-time notification count updates ──────────────────────
    socket.on(
      SOCKET_EVENTS.NOTIFICATION_COUNT,
      (payload: NotificationCountPayload) => {
        console.log("[Socket] notification:count →", payload);
        // On the first push of a session there is no previous socket value yet,
        // so fall back to the REST-cached count as the baseline.
        const prevCount =
          liveCountRef.current?.total.count ??
          queryClient.getQueryData<NotificationCountPayload>(["unreadCount"])?.total
            .count ??
          0;
        if (payload.total.count > prevCount) {
          playNotificationSound();
        }
        liveCountRef.current = payload;
        setLiveCount(payload);
      }
    );

    // ── Listen for announcement notification socket ──────────────────────────
    socket.on(SOCKET_EVENTS.ANNOUNCEMENT_NOTIFICATION, () => {
      console.log("[Socket] notification:announcement received");
      playNotificationSound();
      setLiveCount((prev) => {
        const cached = queryClient.getQueryData<NotificationCountPayload>(["unreadCount"]);
        const base = prev || cached || {
          total: { count: 0, isCapped: false },
          notifications: { count: 0, isCapped: false },
          contactRequests: { count: 0, isCapped: false },
        };

        const currentNotifCount = base.notifications?.count ?? 0;
        const currentContactCount = base.contactRequests?.count ?? 0;
        const newNotifCount = currentNotifCount + 1;
        const newTotal = newNotifCount + currentContactCount;

        const updated: NotificationCountPayload = {
          total: { count: newTotal, isCapped: base.total?.isCapped || false },
          notifications: { count: newNotifCount, isCapped: base.notifications?.isCapped || false },
          contactRequests: base.contactRequests || { count: currentContactCount, isCapped: false },
        };

        queryClient.setQueryData(["unreadCount"], updated);
        liveCountRef.current = updated;
        return updated;
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    });

    // ── Listen for force logout ──────────────────────────────────────────────
    socket.on(SOCKET_EVENTS.FORCE_LOGOUT, async () => {
      console.warn("[Socket] Received auth:force-logout. Logging out and redirecting to banned page.");
      try { await logout(); } catch { /* ignore */ }
      window.location.href = `/${localStorage.getItem("maza3eat-locale") || "en"}/banned`;
    });

    // Cleanup on unmount or when auth changes
    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_COUNT);
      socket.off(SOCKET_EVENTS.ANNOUNCEMENT_NOTIFICATION);
      socket.off(SOCKET_EVENTS.FORCE_LOGOUT);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, isLoading]);

  return (
    <SocketContext.Provider value={{ liveCount, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSocket(): SocketContextType {
  return useContext(SocketContext);
}
