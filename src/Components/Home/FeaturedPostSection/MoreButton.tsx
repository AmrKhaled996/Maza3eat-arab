import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../../i18n/useLocale";
import { useNavigate } from "react-router-dom";
import { localizedPath } from "../../../i18n/paths";


function HomeFeaturedPostsSectionMoreButton() {
  const { t } = useTranslation("common");
    const { lang } = useLocale();
    const navigate = useNavigate();
  return (
    <div 
    onClick={() => navigate(localizedPath(lang, "featured"))}
    className="flex justify-center mt-10">
      <button className="flex items-center gap-3 text-sm font-bold px-8 py-3.5 rounded-full  hover:shadow-lg transition-all group main-gradient text-white hover:cursor-pointer ">
        <span className="group-hover:translate-x-1 transition-transform   flex items-end justify-center gap-3 ">
          <ArrowRight size={16} className="text-white" />{" "}
          {t("home.featuredMore")}
        </span>
      </button>
    </div>
  );
}

export default HomeFeaturedPostsSectionMoreButton;