import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotifications } from "../../Hooks/useNotifications";
import NavigationBar from "../../Components/shared/NavigationBar";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import type { Notification, ContactRequest } from "../../Types/Notification";
import { fetchContactRequestById } from "../../Apis/ContactRequestApi";
import Skeleton from "../../Components/shared/Skeleton";
import {
  Heart,
  MessageCircle,
  CheckCircle,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  Clock,
  Compass,
  Info,
  MoreHorizontal,
  Flag,
} from "lucide-react";

export default function NotificationsPage() {
  const { lang } = useLocale();
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const {
    notifications,
    contactRequests,
    isLoading,
    unreadCount,
    markAsRead,
    respondToContactRequest,
    refetch,
  } = useNotifications();

  // Contact method modal state for accepting requests
  const [acceptModalReq, setAcceptModalReq] = useState<ContactRequest | null>(null);
  const [contactMethodType, setContactMethodType] = useState<"FACEBOOK" | "WHATSAPP" | "INSTAGRAM" | "EMAIL">("WHATSAPP");
  const [contactMethodValue, setContactMethodValue] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);

  // Active tab state: 'notifications' | 'contacts'
  const [activeTab, setActiveTab] = useState<"notifications" | "contacts">("notifications");

  // Modals state
  const [reasonModalReq, setReasonModalReq] = useState<ContactRequest | null>(null);
  const [contactInfoModalReq, setContactInfoModalReq] = useState<ContactRequest | null>(null);

  // Time formatter helper
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

  // User tier background and border styling
  const getTierBadgeStyles = (tierName: string) => {
    switch (tierName) {
      case "gold":
        return "bg-amber-50 text-amber-600 border border-amber-200/50";
      case "silver":
        return "bg-slate-50 text-slate-500 border border-slate-200/50";
      case "copper":
        return "bg-orange-50 text-orange-600 border border-orange-200/50";
      default:
        return "bg-gray-50 text-gray-500 border border-gray-100";
    }
  };

  // Helper for notification type icons & colors
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "QUESTION_LIKE":
      case "POST_LIKE":
        return {
          icon: <Heart className="h-3 w-3 fill-red-500 text-red-500" />,
          bgColor: "bg-red-50 ring-4 ring-white",
        };
      case "ANSWER":
        return {
          icon: <CheckCircle className="h-3 w-3 text-emerald-500 fill-white" />,
          bgColor: "bg-emerald-50 ring-4 ring-white",
        };
      case "COMMENT":
      case "COMMENT_REPLY":
      case "COMMENT_REPLY_REPLY":
      case "ANSWER_REPLY":
      case "ANSWER_REPLY_REPLY":
        return {
          icon: <MessageCircle className="h-3 w-3 text-blue-500 fill-white" />,
          bgColor: "bg-blue-50 ring-4 ring-white",
        };
      case "POST_APPROVAL":
      case "QUESTION_APPROVAL":
        return {
          icon: <ShieldCheck className="h-3 w-3 text-emerald-600" />,
          bgColor: "bg-emerald-50 ring-4 ring-white",
        };
      case "POST_REJECTION":
      case "QUESTION_REJECTION":
        return {
          icon: <ShieldAlert className="h-3 w-3 text-red-600" />,
          bgColor: "bg-red-50 ring-4 ring-white",
        };
      default:
        return {
          icon: <Info className="h-3 w-3 text-gray-500" />,
          bgColor: "bg-gray-50 ring-4 ring-white",
        };
    }
  };

  // Generate HTML-like text for notification item
  const renderNotificationText = (n: Notification) => {
    const senderName = n.sender?.name || (lang === "ar" ? "الإدارة" : "Admin");
    const count = n.aggregatorCount || 0;
    const othersText = count > 0 ? ` ${t("notifications.andOthers", { count })}` : "";

    if (lang === "ar") {
      switch (n.type) {
        case "QUESTION_LIKE":
          return (
            <span>
              قام <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} بالإعجاب بسؤالك
            </span>
          );
        case "POST_LIKE":
          return (
            <span>
              قام <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} بالإعجاب بمنشورك
            </span>
          );
        case "ANSWER":
          return (
            <span>
              قام <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} بالإجابة على سؤالك
            </span>
          );
        case "COMMENT":
          return (
            <span>
              قام <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} بالتعليق على منشورك
            </span>
          );
        case "COMMENT_REPLY":
          return (
            <span>
              رد <strong className="font-extrabold text-gray-900">{senderName}</strong> على تعليقك
            </span>
          );
        case "COMMENT_REPLY_REPLY":
          return (
            <span>
              رد <strong className="font-extrabold text-gray-900">{senderName}</strong> على ردك
            </span>
          );
        case "ANSWER_REPLY":
          return (
            <span>
              رد <strong className="font-extrabold text-gray-900">{senderName}</strong> على إجابتك
            </span>
          );
        case "ANSWER_REPLY_REPLY":
          return (
            <span>
              رد <strong className="font-extrabold text-gray-900">{senderName}</strong> على ردك على إجابة
            </span>
          );
        case "POST_APPROVAL":
          return <span>تمت الموافقة على منشورك من قبل الإدارة — <span className="text-primary hover:underline font-semibold">{t("notifications.seeItNow")}</span></span>;
        case "QUESTION_APPROVAL":
          return <span>تمت الموافقة على سؤالك — <span className="text-primary hover:underline font-semibold">{t("notifications.seeItNow")}</span></span>;
        case "POST_REJECTION":
          return <span>تم رفض منشورك من قبل الإدارة — <span className="text-red-500 font-semibold">{t("notifications.seeItNow")}</span></span>;
        case "QUESTION_REJECTION":
          return <span>تم رفض سؤالك من قبل الإدارة — <span className="text-red-500 font-semibold">{t("notifications.seeItNow")}</span></span>;
        default:
          return <span>إشعار جديد</span>;
      }
    } else {
      switch (n.type) {
        case "QUESTION_LIKE":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} liked your question
            </span>
          );
        case "POST_LIKE":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} liked your post
            </span>
          );
        case "ANSWER":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} answered your question
            </span>
          );
        case "COMMENT":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong>
              {othersText} commented on your post
            </span>
          );
        case "COMMENT_REPLY":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong> replied to your comment
            </span>
          );
        case "COMMENT_REPLY_REPLY":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong> replied to your reply
            </span>
          );
        case "ANSWER_REPLY":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong> replied to your answer
            </span>
          );
        case "ANSWER_REPLY_REPLY":
          return (
            <span>
              <strong className="font-extrabold text-gray-900">{senderName}</strong> replied to your answer reply
            </span>
          );
        case "POST_APPROVAL":
          return <span>Your post has been approved by admin — <span className="text-primary hover:underline font-semibold">{t("notifications.seeItNow")}</span></span>;
        case "QUESTION_APPROVAL":
          return <span>Your question has been approved — <span className="text-primary hover:underline font-semibold">{t("notifications.seeItNow")}</span></span>;
        case "POST_REJECTION":
          return <span>Your post was rejected by admin — <span className="text-red-500 font-semibold">{t("notifications.seeItNow")}</span></span>;
        case "QUESTION_REJECTION":
          return <span>Your question was rejected by admin — <span className="text-red-500 font-semibold">{t("notifications.seeItNow")}</span></span>;
        default:
          return <span>New notification</span>;
      }
    }
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }

    // Navigate to the notification detail for all types (server marks it read)
    navigate(localizedPath(lang, `notifications/${n.id}`));
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      <NavigationBar page="notifications" solidNav />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        
        <div className="sticky top-24 z-10 mb-8 pt-6 flex flex-col items-center">
          {/* Dynamic Tabs Pills Container */}
          <div className="w-full bg-gray-100/80 p-1 rounded-2xl flex gap-1 border border-gray-200/50 backdrop-blur-md shadow-sm">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "notifications"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:cursor-pointer"
              }`}
            >
              {t("notifications.tabNotifications")}
              {unreadCount.notifications.count > 0 && (
                <span className="ms-2 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount.notifications.count}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === "contacts"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:cursor-pointer"
              }`}
            >
              {t("notifications.tabContactRequests")}
              {unreadCount.contactRequests.count > 0 && (
                <span className="ms-2 bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount.contactRequests.count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            
            {/* List View */}
            {isLoading ? (
              // Skeletons list
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-4 animate-pulse">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 border border-gray-100 text-gray-400">
                  <Compass className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("notifications.emptyTitleNotif")}</h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
                  {t("notifications.emptySubNotif")}
                </p>
                <button
                  onClick={() => navigate(localizedPath(lang, "community"))}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:cursor-pointer"
                >
                  {t("notifications.exploreFeed")}
                </button>
              </div>
            ) : (
              // Active Notifications List
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-gray-50">
                {notifications.map((n) => {
                  const iconConfig = getNotificationIcon(n.type);
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-5 flex gap-4 transition-all hover:bg-gray-50/50 hover:cursor-pointer items-start relative ${
                        !n.isRead ? "bg-blue-50/50" : ""
                      }`}
                    >
                      {/* Left side: Avatar + type badge */}
                      <div className="relative shrink-0">
                        {n.sender ? (
                          <img
                            src={n.sender.avatar}
                            alt={n.sender.name}
                            className="h-11 w-11 rounded-full object-cover border border-gray-100 shadow-sm"
                          />
                        ) : (
                          // System Admin Notification placeholder avatar
                          <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary font-bold text-sm">
                            AD
                          </div>
                        )}
                        <div className={`absolute -bottom-1.5 -inset-e-1.5 p-1 rounded-full ${iconConfig.bgColor} border border-white shadow-sm flex items-center justify-center`}>
                          {iconConfig.icon}
                        </div>
                      </div>

                      {/* Middle: Content */}
                      <div className="flex-1 space-y-1">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {renderNotificationText(n)}
                        </div>
                        <div className="flex items-center gap-2">
                          {n.sender?.tier && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getTierBadgeStyles(n.sender.tier.name)}`}>
                              {n.sender.tier.name}
                            </span>
                          )}
                          {!n.sender && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              n.type === "POST_REJECTION" || n.type === "QUESTION_REJECTION"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                              {n.type === "POST_REJECTION" || n.type === "QUESTION_REJECTION"
                                ? (lang === "ar" ? "مرفوض" : "Rejected")
                                : t("notifications.official")}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(n.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Right side: Unread Dot */}
                      {!n.isRead && (
                        <div className="self-center shrink-0 w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contact Requests Tab */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            
            {isLoading ? (
              // Skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-4 animate-pulse">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded" />
                  </div>
                </div>
              ))
            ) : contactRequests.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 border border-gray-100 text-gray-400">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t("notifications.emptyTitleContact")}</h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
                  {t("notifications.emptySubContact")}
                </p>
                <button
                  onClick={() => navigate(localizedPath(lang, "community"))}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:cursor-pointer"
                >
                  {t("notifications.exploreFeed")}
                </button>
              </div>
            ) : (
              // Active Contact Requests list
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-gray-50">
                {contactRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 flex gap-4 items-start transition-all hover:bg-gray-50/20"
                  >
                    {/* User Avatar */}
                    <img
                      src={req.user.avatar}
                      alt={req.user.name}
                      className="h-11 w-11 rounded-full object-cover border border-gray-100 shadow-sm shrink-0"
                    />

                    {/* Request Details */}
                    <div className="flex-1 space-y-1">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {req.direction === "RECEIVED" ? (
                          <span>
                            أرسل لك <strong className="font-extrabold text-gray-900">{req.user.name}</strong> طلب تواصل
                          </span>
                        ) : (
                          <span>
                            قبل <strong className="font-extrabold text-gray-900">{req.user.name}</strong> طلب التواصل الخاص بك
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getTierBadgeStyles(req.user.tier.name)}`}>
                          {req.user.tier.name}
                        </span>

                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(req.createdAt)}
                        </span>

                        <span className="text-xs text-gray-300">•</span>

                        {/* Interactive trigger label */}
                        {req.direction === "RECEIVED" && req.status === "PENDING" && (
                          <button
                            onClick={() => setReasonModalReq(req)}
                            className="text-xs font-bold text-primary hover:underline hover:cursor-pointer"
                          >
                            {t("notifications.viewReason")}
                          </button>
                        )}

                        {req.direction === "SENT" && req.status === "ACCEPTED" && (
                          <button
                            onClick={async () => {
                              const detailed = await fetchContactRequestById(req.id);
                              if (detailed) {
                                setContactInfoModalReq(detailed);
                              } else {
                                setContactInfoModalReq(req);
                              }
                            }}
                            className="text-xs font-bold text-emerald-600 hover:underline hover:cursor-pointer flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>{t("notifications.viewContact")}</span>
                          </button>
                        )}

                        {req.status === "ACCEPTED" && req.direction === "RECEIVED" && (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>{lang === "ar" ? "تم القبول" : "Accepted"}</span>
                          </span>
                        )}

                        {req.status === "DECLINED" && (
                          <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                            <X className="h-3 w-3" />
                            <span>{lang === "ar" ? "تم الرفض" : "Declined"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Refresh button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:cursor-pointer flex items-center gap-2 transition-all text-sm shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{lang === "ar" ? "تحديث" : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: Contact Request Reason (Received Pending) */}
      {reasonModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-gray-100 shadow-2xl relative animate-scale-up">
            <div className="absolute top-4 inset-e-4 flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setIsReportMenuOpen(!isReportMenuOpen)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors hover:cursor-pointer"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {isReportMenuOpen && (
                  <div className="absolute top-full mt-1 end-0 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-10 animate-fade-in">
                    <button
                      onClick={async () => {
                        setIsReporting(true);
                        try {
                          const { reportContactRequest } = await import('../../Apis/ContactRequestApi');
                          await reportContactRequest(reasonModalReq.id, "Inappropriate contact request message");
                          alert(lang === "ar" ? "تم الإبلاغ بنجاح" : "Reported successfully");
                          setReasonModalReq(null);
                        } catch (err: any) {
                          const msg = err?.response?.data?.message || (lang === "ar" ? "فشل الإبلاغ" : "Failed to report");
                          alert(msg);
                        } finally {
                          setIsReporting(false);
                          setIsReportMenuOpen(false);
                        }
                      }}
                      disabled={isReporting}
                      className="w-full text-start px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 flex items-center gap-2 hover:cursor-pointer transition-colors"
                    >
                      <Flag className="h-4 w-4" />
                      {isReporting ? "..." : (lang === "ar" ? "إبلاغ عن هذا الطلب" : "Report this request")}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setReasonModalReq(null);
                  setIsReportMenuOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors hover:cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 pt-8 text-center">
              <img
                src={reasonModalReq.user.avatar}
                alt={reasonModalReq.user.name}
                className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-primary/10 shadow-md mb-3"
              />
              <h3 className="text-lg font-extrabold text-gray-900">{reasonModalReq.user.name}</h3>
              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 mt-1 rounded-full capitalize ${getTierBadgeStyles(reasonModalReq.user.tier.name)}`}>
                {reasonModalReq.user.tier.name}
              </span>

              <div className="my-6 p-4 bg-gray-50 rounded-2xl text-start text-sm text-gray-600 leading-relaxed border border-gray-100">
                <span className="block font-bold text-gray-800 text-xs mb-1.5 uppercase tracking-wider text-gray-400">
                  {t("notifications.reasonTitle")}
                </span>
                {reasonModalReq.reason}
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAcceptModalReq(reasonModalReq);
                      setReasonModalReq(null);
                      setContactMethodType("WHATSAPP");
                      setContactMethodValue("");
                    }}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 hover:cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    {t("notifications.accept")}
                  </button>
                  <button
                    onClick={async () => {
                      await respondToContactRequest({ id: reasonModalReq.id, action: "DECLINED" });
                      setReasonModalReq(null);
                    }}
                    className="flex-1 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl border border-red-100 hover:cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    {t("notifications.decline")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View Contact Info (Sent Accepted) */}
      {contactInfoModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-gray-100 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setContactInfoModalReq(null)}
              className="absolute top-4 inset-e-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors hover:cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 pt-8">
              <div className="text-center mb-6">
                <img
                  src={contactInfoModalReq.user.avatar}
                  alt={contactInfoModalReq.user.name}
                  className="h-16 w-16 rounded-full object-cover mx-auto border-2 border-primary/10 shadow-md mb-3"
                />
                <h3 className="text-lg font-extrabold text-gray-900">{contactInfoModalReq.user.name}</h3>
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 mt-1 rounded-full capitalize ${getTierBadgeStyles(contactInfoModalReq.user.tier.name)}`}>
                  {contactInfoModalReq.user.tier.name}
                </span>
              </div>

              <div className="space-y-3.5 mb-6">
                <span className="block font-bold text-gray-400 text-xs mb-1.5 uppercase tracking-wider">
                  {t("notifications.contactInfoTitle")}
                </span>

                {/* Email row */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold">{t("notifications.email")}</span>
                    <a href={`mailto:${contactInfoModalReq.contactInfo?.email}`} className="text-sm font-bold text-gray-800 hover:text-primary break-all">
                      {contactInfoModalReq.contactInfo?.email || "n/a"}
                    </a>
                  </div>
                </div>

                {/* Phone row */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-semibold">{t("notifications.phone")}</span>
                    <a href={`tel:${contactInfoModalReq.contactInfo?.phone}`} className="text-sm font-bold text-gray-800 hover:text-primary">
                      {contactInfoModalReq.contactInfo?.phone || "n/a"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {contactInfoModalReq.contactInfo?.phone && (
                  <a
                    href={`https://wa.me/${contactInfoModalReq.contactInfo.phone.replace("+", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 hover:cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{t("notifications.whatsapp")}</span>
                  </a>
                )}
                
                <button
                  onClick={() => setContactInfoModalReq(null)}
                  className="w-full py-3 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all hover:cursor-pointer"
                >
                  {t("notifications.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Accept Contact Request – collect contact info */}
      {acceptModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-gray-100 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setAcceptModalReq(null)}
              className="absolute top-4 inset-e-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors hover:cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 pt-8">
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 text-center">
                {lang === "ar" ? "شارك معلومات التواصل" : "Share Contact Info"}
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                {lang === "ar"
                  ? "أضف طريقة التواصل التي ستشاركها مع الطرف الآخر"
                  : "Choose how you'd like to be contacted"}
              </p>

              {/* Contact method type selector */}
              <div className="flex gap-2 mb-4">
                {(["FACEBOOK", "WHATSAPP", "INSTAGRAM", "EMAIL"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setContactMethodType(type);
                      setContactMethodValue("");
                    }}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all hover:cursor-pointer ${
                      contactMethodType === type
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {type === "FACEBOOK" ? "📘 Facebook" : type === "EMAIL" ? "✉️ Email" : type === "WHATSAPP" ? "💬 WhatsApp" : "📸 Instagram"}
                  </button>
                ))}
              </div>

              {/* Contact value input */}
              <input
                type={contactMethodType === "EMAIL" ? "email" : contactMethodType === "WHATSAPP" ? "tel" : "url"}
                placeholder={
                  contactMethodType === "EMAIL"
                    ? "you@example.com"
                    : contactMethodType === "WHATSAPP"
                    ? "+201234567890"
                    : "https://..."
                }
                value={contactMethodValue}
                onChange={(e) => setContactMethodValue(e.target.value)}
                className="w-full mb-6 p-3 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />

              <div className="flex gap-3">
                <button
                  disabled={
                    !contactMethodValue.trim() ||
                    (contactMethodType === "EMAIL" && !/^\S+@\S+\.\S+$/.test(contactMethodValue)) ||
                    (contactMethodType === "WHATSAPP" && !/^\+?\d{10,15}$/.test(contactMethodValue)) ||
                    ((contactMethodType === "FACEBOOK" || contactMethodType === "INSTAGRAM") && !/^https?:\/\/.+/.test(contactMethodValue))
                  }
                  onClick={async () => {
                    if (!contactMethodValue.trim()) return;
                    await respondToContactRequest({
                      id: acceptModalReq.id,
                      action: "ACCEPTED",
                      contactMethod: { type: contactMethodType, value: contactMethodValue.trim() },
                    });
                    setAcceptModalReq(null);
                    setContactMethodValue("");
                  }}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/10 hover:cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  {t("notifications.accept")}
                </button>
                <button
                  onClick={() => setAcceptModalReq(null)}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-2xl border border-gray-200 hover:cursor-pointer"
                >
                  {t("notifications.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
