import { AlertCircle, ShieldAlert, X } from "lucide-react";
import { useLocale } from "../../i18n/useLocale";

interface ContactGuidelinesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ContactGuidelinesModal({
  isOpen,
  onConfirm,
  onCancel,
}: ContactGuidelinesModalProps) {
  const { lang } = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
        <button
          onClick={onCancel}
          className="absolute top-4 end-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-amber-50/50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 mb-2">
          {lang === "ar" ? "قواعد وإرشادات التواصل" : "Community Contact Guidelines"}
        </h3>

        <div className="text-start bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-xs text-amber-900 leading-relaxed mb-6 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{lang === "ar" ? "يرجى اتباع الإرشادات التالية:" : "Please follow these rules:"}</span>
          </p>
          <ul className="list-disc pl-4 space-y-1 text-amber-800/90">
            <li style={{listStyleType: "none",paddingInline:0}}>{lang === "ar" ? "احترم خصوصية جميع الأعضاء" : "Respect member privacy at all times."}</li>
            <li style={{listStyleType: "none",paddingInline:0}}>{lang === "ar" ? "لا ترسل رسائل مزعجة أو غير لائقة" : "Do not send spam, harassing or inappropriate messages."}</li>
            <li style={{listStyleType: "none",paddingInline:0}}>{lang === "ar" ? "قد تؤدي مخالفة القوانين إلى حظر حسابك فوراً" : "Violations will result in immediate account ban."}</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition-all cursor-pointer text-sm"
          >
            {lang === "ar" ? "أوافق ومتابعة" : "Agree & Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}
