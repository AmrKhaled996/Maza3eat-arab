import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useNotifications } from "../../Hooks/useNotifications";
import { useTranslation } from "react-i18next";
import NavigationBar from "../../Components/shared/NavigationBar";
import { ArrowLeft, ArrowRight, Calendar, Shield, Megaphone, CheckCircle2, ExternalLink } from "lucide-react";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

// Simple custom markdown parser to convert basic md syntax to JSX
function parseMarkdown(text: string) {
  if (!text) return "";
  
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    // Header 1
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-3xl font-extrabold text-gray-900 mt-6 mb-4 leading-tight">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
    }
    // Header 2
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-2xl font-bold text-gray-800 mt-5 mb-3">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
    }
    // Blockquote
    if (trimmed.startsWith("> ")) {
      // Check for alert style like > [!IMPORTANT]
      const quoteText = trimmed.slice(2);
      if (quoteText.startsWith("[!IMPORTANT]")) {
        return (
          <div key={idx} className="my-5 p-4 bg-red-50 border-s-4 border-red-500 rounded-e-xl text-red-900">
            <div className="font-bold mb-1">تنبيه هام / Important Notification</div>
            <p className="text-sm">{parseInlineMarkdown(quoteText.slice(12).trim())}</p>
          </div>
        );
      }
      return (
        <blockquote key={idx} className="my-4 ps-4 border-s-4 border-gray-300 italic text-gray-600">
          {parseInlineMarkdown(quoteText)}
        </blockquote>
      );
    }
    // Bullet list
    if (trimmed.startsWith("- ")) {
      return (
        <li key={idx} className="ms-6 list-disc text-gray-700 my-1">
          {parseInlineMarkdown(trimmed.slice(2))}
        </li>
      );
    }
    // Empty line
    if (trimmed === "") {
      return <div key={idx} className="h-3" />;
    }
    // Divider
    if (trimmed === "---") {
      return <hr key={idx} className="my-6 border-gray-200" />;
    }
    // Default Paragraph
    return (
      <p key={idx} className="text-gray-700 leading-relaxed my-2 text-md">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
}

function parseInlineMarkdown(text: string) {
  // Support bold **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="font-bold text-gray-900">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useLocale();
  const { t } = useTranslation("common");
  const { notifications, markAsRead } = useNotifications();

  const notification = notifications.find((n) => n.id === id);

  // Automatically mark notification as read when viewed
  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  if (!notification) {
    return (
      <div className="min-h-screen pb-16 bg-gray-50/50">
        <NavigationBar page="notifications" solidNav />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 text-center">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {lang === "ar" ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </button>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lang === "ar" ? "الإشعار غير موجود" : "Notification Not Found"}
            </h1>
            <p className="text-gray-500">
              {lang === "ar" ? "ربما تم حذف هذا الإشعار أو أنه غير متوفر حالياً." : "This notification might have been deleted or is unavailable."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper for layout styles based on notification type
  const getTypeConfig = () => {
    switch (notification.type) {
      case "ADMIN_ANNOUNCE":
        return {
          icon: <Megaphone className="h-6 w-6 text-white" />,
          bgColor: "bg-red-500",
          lightBg: "bg-red-50",
          textColor: "text-red-700",
          badgeKey: "notifications.urgent",
        };
      case "POST_APPROVE":
      case "QUESTION_APPROVE":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-white" />,
          bgColor: "bg-green-500",
          lightBg: "bg-green-50",
          textColor: "text-green-700",
          badgeKey: "notifications.official",
        };
      default:
        return {
          icon: <Shield className="h-6 w-6 text-white" />,
          bgColor: "bg-blue-500",
          lightBg: "bg-blue-50",
          textColor: "text-blue-700",
          badgeKey: "notifications.official",
        };
    }
  };

  const config = getTypeConfig();

  // Route target for the see it now action
  const getActionRoute = () => {
    if (notification.type === "POST_APPROVE" && notification.resourceId) {
      return localizedPath(lang, `post/${notification.resourceId}`);
    }
    if (notification.type === "QUESTION_APPROVE" && notification.resourceId) {
      return localizedPath(lang, `q&a/${notification.resourceId}`);
    }
    return null;
  };

  const actionRoute = getActionRoute();

  // Relative time helper
  const formatTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t("notifications.justNow");
    if (diffMins < 60) return t("notifications.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("notifications.hoursAgo", { count: diffHours });
    if (diffDays === 1) return t("notifications.yesterday");
    return t("notifications.daysAgo", { count: diffDays });
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50/50">
      <NavigationBar page="notifications" solidNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        {/* Back Button */}
        <button
          onClick={() => navigate(localizedPath(lang, "notifications"))}
          className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:cursor-pointer transition-transform hover:scale-105"
          aria-label={t("createPost.back")}
        >
          {lang === "ar" ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
        </button>

        {/* Detailed Notification Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Header Colored Band */}
          <div className={`h-2 ${config.bgColor}`} />
          
          <div className="p-8 sm:p-10">
            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${config.lightBg} flex items-center justify-center`}>
                  {notification.type === "ADMIN_ANNOUNCE" ? (
                    <Megaphone className="h-5 w-5 text-red-500" />
                  ) : notification.type.includes("APPROVE") ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-gray-900">
                      {notification.sender?.name || (lang === "ar" ? "الإدارة" : "Admin")}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${config.lightBg} ${config.textColor}`}>
                      {t(config.badgeKey)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatTime(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-snug">
              {notification.title || (lang === "ar" ? "تفاصيل الإشعار" : "Notification Details")}
            </h1>

            <hr className="border-gray-100 mb-6" />

            {/* Body Content */}
            <div className="prose max-w-none text-gray-700">
              {notification.body ? (
                parseMarkdown(notification.body)
              ) : (
                <p className="text-lg leading-relaxed text-gray-600">
                  {lang === "ar" 
                    ? `تمت الموافقة على ${notification.type === "POST_APPROVE" ? "منشورك" : "سؤالك"} بنجاح من قبل فريق الإدارة. يمكنك الآن الاطلاع عليه والتفاعل مع الأعضاء.`
                    : `Your ${notification.type === "POST_APPROVE" ? "post" : "question"} has been successfully approved by the administration team. You can view it now and interact with other members.`
                  }
                </p>
              )}
            </div>

            {/* Actions Footer */}
            {(actionRoute || notification.body) && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-4 justify-end">
                {actionRoute && (
                  <button
                    onClick={() => navigate(actionRoute)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:-translate-y-0.5 hover:cursor-pointer"
                  >
                    <span>{t("notifications.seeItNow")}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => navigate(localizedPath(lang, "notifications"))}
                  className="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all hover:cursor-pointer"
                >
                  {t("notifications.backToNotifications")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
