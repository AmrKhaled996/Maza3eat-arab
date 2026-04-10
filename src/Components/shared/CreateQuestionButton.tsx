import { ArrowRight, CircleQuestionMarkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

function CreateQuestionButton() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const navigate = useNavigate();
  return (
    <div className="flex justify-center ">
          <button
            type="button"
            onClick={() => navigate(localizedPath(lang, "create-q&a"))}
            className="flex items-center  bg-linear-to-r from-secondary to-accent gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap"
          >
            <CircleQuestionMarkIcon
              className={`bg-white rounded-full p-0 m-0 ${lang === "en" ? "text-secondary" : "text-accent"}`}
              size={16}
            />{" "}
            {t("home.qnaAsk")}
          </button>
    </div>
  );
}

export default CreateQuestionButton;