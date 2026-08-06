import { useTranslation } from "react-i18next";
import Dialog from "../shared/DialogContainer";
import { LoaderIcon } from "lucide-react";

function DeleteQuestionDialog({ open, onClose, onConfirm,loading }: { open: boolean, onClose: () => void, onConfirm: () => void,loading?:boolean }) {
          const { t } = useTranslation();
    return ( <Dialog open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">{t("profile.deleteQuestionDialog.title")}</h3>
      <p className="text-gray-600 mb-4">
        {t("profile.deleteQuestionDialog.message")}
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          {t("common.actions.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {loading ? <LoaderIcon className="animate-spin" />: t("profile.deleteQuestionDialog.deleteButton")}
        </button>
      </div>
    </Dialog> );
}

export default DeleteQuestionDialog;