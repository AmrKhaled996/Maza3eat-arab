import { useTranslation } from "react-i18next";
import Dialog from "../shared/DialogContainer";
import { LoaderIcon } from "lucide-react";

export default function ContactDialog({
  open,
  onClose,
  onConfirm,
  loading,
  setReason,
  setError,
  error
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  setReason: (reason: string) => void;
  setError: (error: string) => void;
  error:string;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-bold text-primary text-shadow-xs mb-4 ">
        {t("profile.contactDialog.title")}
      </h3>
      <hr className="mb-4 text-primary " />
      <p className="text-gray-600 mb-4">
        {t("profile.contactDialog.description")}
      </p>
      <textarea
        className="w-full h-50 border border-slate-400 rounded-lg px-3 py-2 my-4 text-sm focus:border-primary focus:outline-primary text-gray-700 placeholder-gray-400 resize-none  scrollbar-hide"
        placeholder={t("profile.contactDialog.inputPlaceholder")}
        onChange={(e) => {
          setReason(e.target.value);
          setError("");
        }}
      ></textarea>

      {error && <small className="text-red-500 mb-4">{error}*</small>}

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          {t("common.actions.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:opacity-80 transition-all duration-300"
        >
          {loading ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            t("profile.contactDialog.contactButton")
          )}
        </button>
      </div>
    </Dialog>
  );
}
