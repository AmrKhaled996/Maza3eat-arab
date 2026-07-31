import { ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SubmissionConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function SubmissionConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: SubmissionConfirmModalProps) {
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="absolute top-4 end-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-blue-50/50">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 mb-2">
          {t("submissionModal.title", "Review Process Notice")}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {t(
            "submissionModal.message",
            "Your post will be reviewed by our team before publishing to ensure it meets our community guidelines. You will be notified once it is approved."
          )}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl main-gradient text-white font-bold hover:opacity-95 shadow-md transition-all cursor-pointer text-sm disabled:opacity-50"
          >
            {isSubmitting ? t("common.publishing", "Publishing...") : t("submissionModal.confirm", "Confirm & Send")}
          </button>
        </div>
      </div>
    </div>
  );
}
