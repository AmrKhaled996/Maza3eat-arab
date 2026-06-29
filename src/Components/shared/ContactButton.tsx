import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { createContactRequest } from "../../Apis/ContactRequestApi";
import { useAuth } from "../../Hooks/Auth";

interface Props {
  /** The ID of the user to send the contact request to */
  receiverId: string;
  /** Optional preset reason text */
  defaultReason?: string;
}

type Status = "idle" | "loading" | "sent" | "error";

export function ContactButton({ receiverId, defaultReason = "" }: Props) {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState(defaultReason);

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
    } catch (err: unknown) {
      console.error("Failed to send contact request:", err);
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
        تواصل
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
                طلب تواصل
              </h3>
              <p className="text-sm text-gray-400 text-center mb-5">
                اكتب سبب رغبتك في التواصل
              </p>

              <textarea
                rows={4}
                placeholder="مرحباً! أود التواصل معك بخصوص..."
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
                  حدث خطأ. حاول مرة أخرى.
                </p>
              )}

              <button
                disabled={!reason.trim() || status === "loading" || status === "sent"}
                onClick={handleSend}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 hover:cursor-pointer flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === "sent" ? (
                  <>
                    <Check size={16} />
                    <span>تم الإرسال!</span>
                  </>
                ) : (
                  <>
                    <Mail size={14} />
                    <span>إرسال طلب التواصل</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}