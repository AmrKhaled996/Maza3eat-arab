import { CompassIcon, CircleQuestionMarkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../shared/NavigationBar";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

export default function AboutHeroSection() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang } = useLocale();

  return (
    <div className="min-h-[80vh] flex flex-col">
      <NavigationBar page="about" solidNav />

      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/70 pt-24">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -start-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -end-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-6 py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
            {t("about.heroTitle")}
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed drop-shadow">
            {t("about.heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              onClick={() => navigate(localizedPath(lang, "community"))}
              className="flex items-center gap-2.5 bg-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span className="text-lg gradient-text flex gap-1 items-end">
                <CompassIcon className="text-secondary" /> {t("about.heroCta1")}
              </span>
            </button>

            <button
              onClick={() => navigate(localizedPath(lang, "q&a"))}
              className="flex items-center gap-2.5 font-bold text-sm sm:text-base px-7 py-3.5 rounded-full border-2 border-white text-white hover:bg-white/15 hover:scale-105 transition-all backdrop-blur-sm"
            >
              <span className="text-lg rounded-full text-secondary">
                <CircleQuestionMarkIcon className="bg-white rounded-full p-0 m-0" />
              </span>
              {t("about.heroCta2")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
