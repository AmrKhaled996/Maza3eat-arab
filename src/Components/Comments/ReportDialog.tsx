import { useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "../shared/DialogContainer";


type ReportReason = "spam" | "harassment" | "hate" | "misinformation" | "other";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setReportReason: (reason: string) => void;
  reportReason: string;
  errorMessage: string;
}

export default function ReportDialog({
  open,
  onClose,
  onConfirm,
  setReportReason,
  reportReason,
  errorMessage,
}: ReportDialogProps) {
  const { t } = useTranslation();

  const [reason, setReason] = useState<ReportReason>("spam");


  const handleSubmit = () => {
    onConfirm();
  };

  const reportReasons: {
    value: ReportReason;
    label: string;
  }[] = [
    {
      value: "spam",
      label: t("report.reasons.spam", "Spam"),
    },
    {
      value: "harassment",
      label: t("report.reasons.harassment", "Harassment or bullying"),
    },
    {
      value: "hate",
      label: t("report.reasons.hate", "Hate speech"),
    },
    {
      value: "misinformation",
      label: t("report.reasons.misinformation", "False information"),
    },
    {
      value: "other",
      label: t("report.reasons.other", "Other"),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <h3 className="mb-2 text-xl font-semibold">
        {t("report.title", "Report")}
      </h3>

      <p className="mb-5 text-sm text-gray-600">
        {t("report.description", "Why are you reporting this content?")}
      </p>

      <div className="space-y-3">
        {reportReasons.map((item) => (
          <div key={item.value}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="report-reason"
                checked={reportReason === item.value}
                onChange={() =>{ setReportReason(item.value)}}
              />

              <span>{item.label}</span>
            </label>

            {item.value === "other" && reportReason === "other" && (
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder={t("report.otherPlaceholder", "Tell us more...")}
                rows={3}
                className="mt-2 w-full rounded-lg border p-3 text-sm outline-none focus:border-primary"
              />
            )}
          </div>
        ))}
      </div>
        {errorMessage && <div className="mt-5 text-sm text-red-500">{errorMessage}</div>}
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded bg-gray-400 px-4 py-2 text-white"
        >
          {t("common.actions.cancel")}
        </button>

        <button
          onClick={handleSubmit}
          disabled={reportReason === "other" && !reportReason.trim()}
          className={`${reportReason === "other" && !reportReason.trim() ? "disabled:cursor-not-allowed disabled:bg-slate-400 opacity-30" : `bg-red-500`} rounded px-4 py-2 text-white`}
        >
          {t("report.submit", "Submit Report")}
        </button>
      </div>
    </Dialog>
  );
}
