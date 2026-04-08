import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

function HomeCommunitySectionCreateButton() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang } = useLocale();
  return (
    <button
      onClick={() => navigate(localizedPath(lang, "create-post"))}
      className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap main-gradient hover:cursor-pointer"
    >
      <span className="text-base">+</span> {t("home.createPost")}
    </button>
  );
}

export default HomeCommunitySectionCreateButton;
