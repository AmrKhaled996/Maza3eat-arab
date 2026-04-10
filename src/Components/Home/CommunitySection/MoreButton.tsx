import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";

function HomeCommunitySectionMoreButton() {
  const { t } = useTranslation("common");
    const { lang } = useLocale();
  const navigate = useNavigate();
  return (
    <div 
    onClick={() => navigate(localizedPath(lang, "community"))}
    className="flex justify-center mt-10">
      <div className="py-0.5 px-[2.5px] main-gradient rounded-full hover:cursor-pointer">
        <button className="flex items-center gap-3 text-sm font-bold px-8 py-3.5 rounded-full  hover:shadow-lg transition-all group bg-white hover:cursor-pointer ">
          <span className="group-hover:translate-x-1 transition-transform  bg-white main-gradient bg-clip-text text-transparent flex items-end justify-center gap-2 ">
            <ArrowRight size={16} className="text-secondary" />{" "}
            {t("home.communityMore")}
          </span>
        </button>
      </div>
    </div>
  );
}

export default HomeCommunitySectionMoreButton;
