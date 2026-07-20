import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = "danger"
}: ConfirmModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getThemeColor = () => {
    switch (type) {
      case "danger": return "text-red-600 bg-red-50";
      case "warning": return "text-orange-600 bg-orange-50";
      case "info": return "text-blue-600 bg-blue-50";
      default: return "text-primary bg-primary/10";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger": return "bg-red-600 hover:bg-red-700 text-white";
      case "warning": return "bg-orange-600 hover:bg-orange-700 text-white";
      case "info": return "bg-blue-600 hover:bg-blue-700 text-white";
      default: return "bg-primary hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-start">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-full ${getThemeColor()}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            {cancelText || t("admin.cancel")}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${getButtonColor()}`}
          >
            {confirmText || t("admin.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
