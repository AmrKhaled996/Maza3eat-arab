import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";

function HomeQandAPostsSectionMoreButton() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const navigate = useNavigate();
  return (
    <div className="flex justify-center mt-10">
      <button 
        onClick={() => navigate(localizedPath(lang, "q&a"))}
      className="flex items-center gap-3 text-sm font-bold px-8 py-3.5 rounded-full  hover:shadow-lg transition-all group main-gradient text-white hover:cursor-pointer ">
        <span className="group-hover:translate-x-1 transition-transform   flex items-end justify-center gap-3 ">
          <ArrowRight size={16} className="text-white" />
          {t("home.qnaJoin")}
        </span>
      </button>
    </div>
  );
}

export default HomeQandAPostsSectionMoreButton;
