import { CircleQuestionMarkIcon, CompassIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import NavigationBar from "../../shared/NavigationBar";
import { useLocale } from "../../../i18n/useLocale";
import { localizedPath } from "../../../i18n/paths";

function HeroSectionLayout() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang } = useLocale();

 

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
        <NavigationBar page="home"/>
      {/* HERO */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[90vh]">
        {/* Background image */}
        <img
          src={`/HeroSection.png`}
          alt={t("hero.imageAlt")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay — primary → secondary → accent */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
            {t("hero.titleLine1")} <br />
            <span className="whitespace-nowrap">{t("hero.titleLine2")}</span>
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed drop-shadow">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              onClick={() => navigate(localizedPath(lang, "community"))}
              className="flex items-center gap-2.5 bg-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg  hover:shadow-xl hover:scale-105 transition-all"
            >
              <span className="text-lg gradient-text flex gap-1 items-end">
                <CompassIcon className="text-secondary" /> {t("hero.ctaCommunity")}{" "}
              </span>
            </button>

            <button
              onClick={() => navigate(localizedPath(lang, "q&a"))}
              className="flex items-center gap-2.5 font-bold text-sm sm:text-base px-7 py-3.5 rounded-full border-2 border-white text-white hover:bg-white/15 hover:scale-105 transition-all backdrop-blur-sm"
            >
              <span className="text-lg  rounded-full text-secondary">
                <CircleQuestionMarkIcon className="bg-white rounded-full p-0 m-0" />
              </span>{" "}
              {t("hero.ctaQna")}
            </button>
          </div>
        </div>

        {/* Bottom fade into page bg */}
        {/* <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #edf3ff)",
          }}
        /> */}
      </div>
    </div>
  );
}

export default HeroSectionLayout;
