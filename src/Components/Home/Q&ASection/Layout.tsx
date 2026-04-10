import type { PropsWithChildren } from "react";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";

function HomeQandALayout({ children }: PropsWithChildren) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang } = useLocale();
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 bg-[#FAF5FE]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-shadow-md">
              {t("home.qnaForumTitle")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("home.qnaForumSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(localizedPath(lang, "create-q&a"))}
            className="flex items-center  bg-linear-to-r from-secondary to-accent gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap"
          >
            <CircleQuestionMarkIcon
              className="bg-white rounded-full p-0 m-0 text-accent"
              size={16}
            />{" "}
            {t("home.qnaAsk")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default HomeQandALayout;
