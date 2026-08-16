import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Check,
  X,
  AlertTriangle,
  Info,
  XIcon,
} from "lucide-react";
import { useLocale } from "../i18n/useLocale";


type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
};

type ToastContextType = {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
  };
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const {lang} = useLocale();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = Date.now() + Math.random();

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          message,
          duration,
        },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, duration?: number) =>
      addToast("success", message, duration),

    error: (message: string, duration?: number) =>
      addToast("error", message, duration),

    warning: (message: string, duration?: number) =>
      addToast("warning", message, duration),

    info: (message: string, duration?: number) =>
      addToast("info", message, duration),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className={`fixed top-5 ${lang === "en" ? "left-5" : "right-5"} z-[9999] flex w-[350px] max-w-[calc(100vw-2rem)] flex-col gap-3`}>
        {toasts.map((item) => (
          <ToastItem
            key={item.id}
            toast={item}
            onClose={() => removeToast(item.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const config = {
    success: {
      icon: <Check size={12} />,
      iconClass: "bg-green-700 text-white",
      borderClass: "border-green-500",
      backgroundClass: "bg-[hsl(147,58%,52%)] drop-shadow-md drop-shadow-[hsl(147,58%,52%)]",

    },

    error: {
      icon: <X size={12} />,
      iconClass: "bg-red-700 text-white",
      borderClass: "border-red-400",
      backgroundClass: "bg-[#F0665A] drop-shadow-md drop-shadow-[#F0665A] ",

    },

    warning: {
      icon: <AlertTriangle size={12} />,
      iconClass: "bg-yellow-400 text-white",
      borderClass: "border-yellow-400",
      backgroundClass: "bg-yellow-200",

    },

    info: {
      icon: <Info size={12} />,
      iconClass: "bg-blue-400 text-white",
      borderClass: "border-blue-400",
      backgroundClass: "bg-blue-200",

    },
  }[toast.type];

  return (
    <div
      className={`flex w-60 items-center opacity-80 gap-3 rounded-xl  border ${config.backgroundClass} p-2 drop-shadow-xs ${config.borderClass} animate-in slide-in-from-right-full duration-300 backdrop-opacity-80 backdrop-blur-lg`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${config.iconClass} shadow-lg`}
      >
        {config.icon}
      </div>

      <p className={`flex-1 text-white text-xs font-medium `}>
        {toast.message}
      </p>

      <button
        onClick={onClose}
        className="text-gray-100 transition hover:text-gray-700 "
      >
        <XIcon size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}