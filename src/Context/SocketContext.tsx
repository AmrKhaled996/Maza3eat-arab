import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./Auth";

// ─── Socket event constants (mirroring backend SOCKET_EVENTS) ─────────────────
export const SOCKET_EVENTS = {
  NOTIFICATION_COUNT: "notification:count",
  FORCE_LOGOUT: "auth:force-logout",
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
  const { isAuthenticated, isLoading } = useAuth();
  const socketRef = useRef<Socket | null>(null);
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        setLiveCount(payload);
      }
    );

    // ── Listen for force logout ──────────────────────────────────────────────
    socket.on(SOCKET_EVENTS.FORCE_LOGOUT, () => {
      console.warn("[Socket] Received auth:force-logout. Redirecting to banned page.");
      // We can trigger a full redirect to handle clearing session
      window.location.href = `/${localStorage.getItem("maza3eat-locale") || "en"}/banned`;
    });

    // Cleanup on unmount or when auth changes
    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_COUNT);
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
