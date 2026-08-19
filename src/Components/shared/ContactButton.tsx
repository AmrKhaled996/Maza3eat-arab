import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Check, Loader2 } from "lucide-react";
import { createContactRequest } from "../../Apis/ContactRequestApi";
import { useAuth } from "../../Hooks/Auth";
import ContactGuidelinesModal from "./ContactGuidelinesModal";
import type { AxiosError } from "axios";
import { useToast } from "../../Context/Toast";
import { useLocale } from "../../i18n/useLocale";

interface Props {
  /** The ID of the user to send the contact request to */
  receiverId: string;
  /** Optional preset reason text */
  defaultReason?: string;
}

type Status = "idle" | "loading" | "sent" | "error";

export function ContactButton({ receiverId, defaultReason = "" }: Props) {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [showModal, setShowModal] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [reason, setReason] = useState(defaultReason);
  const {toast}=useToast();
  const handleOpen = () => {
    if (!isAuthenticated) return; // ProtectedRoute handles redirect
    setShowModal(true);
  };

  const handleSend = async () => {
    if (!reason.trim()) return;
    setStatus("loading");
    try {
      await createContactRequest(receiverId, reason.trim());
      setStatus("sent");
      // Auto-close after 1.5 s
      setTimeout(() => {
        setShowModal(false);
        setStatus("idle");
        setReason(defaultReason);
      }, 1500);
    } catch (err: any) {

      console.error("Failed to send contact request:", err?.response?.status);
      if(err?.response?.status === 429) {
        toast.error(lang==="ar"?"لقد ارسلت طلبا بالفعل  حاول مرة اخرى بعد اسبوع":"You have already sent a request, try again after a week");

      }
      setStatus("error");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1 text-[11px] font-semibold bg-purple-200 text-purple-600 border border-purple-200 px-2.5 py-0.5 rounded-full hover:bg-purple-100 transition-colors hover:cursor-pointer"
      >
        <Mail size={12} className="text-secondary" />
        {t("contactRequest.button")}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setStatus("idle");
            }
          }}
        >
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-gray-100 shadow-2xl relative">
            {/* Close */}
            <button
              onClick={() => {
                setShowModal(false);
                setStatus("idle");
              }}
              className="absolute top-4 end-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors hover:cursor-pointer"
            >
              ✕
            </button>

            <div className="p-6 pt-8">
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 text-center">
                {t("contactRequest.modalTitle")}
              </h3>
              <p className="text-sm text-gray-400 text-center mb-5">
                {t("contactRequest.modalSubtitle")}
              </p>

              <textarea
                rows={4}
                placeholder={t("contactRequest.reasonPlaceholder")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                disabled={status === "loading" || status === "sent"}
                className="w-full mb-1 p-3 border border-gray-200 rounded-2xl text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-60"
              />
              <div className="text-xs text-gray-400 text-end mb-4">
                {reason.length}/500
              </div>

              {status === "error" && (
                <p className="text-xs text-red-500 mb-3 text-center">
                  {t("contactRequest.sendError")}
                </p>
              )}

              <button
                disabled={!reason.trim() || status === "loading" || status === "sent"}
                onClick={() => setShowGuidelines(true)}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 hover:cursor-pointer flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === "sent" ? (
                  <>
                    <Check size={16} />
                    <span className="text-sm">{t("contactRequest.sentSuccess")}</span>
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    <span className="text-sm">{t("contactRequest.sendButton")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ContactGuidelinesModal
        isOpen={showGuidelines}
        onCancel={() => setShowGuidelines(false)}
        onConfirm={() => {
          setShowGuidelines(false);
          handleSend();
        }}
      />
    </>
  );
}