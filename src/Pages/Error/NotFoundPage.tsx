
import { useNavigate } from "react-router-dom";
import { Title } from "react-head";
import { MapPinOff, Home, ArrowLeft, Compass } from "lucide-react";
import NavigationBar from "../../Components/shared/NavigationBar";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { lang } = useLocale();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Title>{t("notFound.meta")}</Title>
      <NavigationBar page="" solidNav />

      <div className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="max-w-lg w-full text-center">
          {/* Animated icon */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full main-gradient opacity-10 animate-ping" />
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
              <MapPinOff size={56} className="text-primary drop-shadow" />
            </div>
          </div>

          {/* 404 number */}
          <h1 className="text-8xl sm:text-9xl font-black gradient-text leading-none mb-2 select-none">
            404
          </h1>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            {t("notFound.title")}
          </h2>

          {/* Subtitle */}
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-md mx-auto mb-10">
            {t("notFound.subtitle")}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(localizedPath(lang, ""))}
              className="flex items-center gap-2 button1 hover:scale-105 transition-transform"
            >
              <Home size={18} />
              {t("notFound.goHome")}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-7 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 hover:scale-105 transition-all"
            >
              <ArrowLeft size={18} />
              {t("notFound.goBack")}
            </button>
          </div>

          {/* Explore suggestion */}
          <div className="mt-14 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Compass size={20} className="text-secondary" />
              <p className="font-semibold text-gray-800 text-sm">
                {t("notFound.exploreTitle")}
              </p>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              {t("notFound.exploreSubtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: t("nav.community"), path: "community" },
                { label: t("nav.featured"), path: "featured" },
                { label: t("nav.qna"), path: "q&a" },
                { label: t("nav.about"), path: "about" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(localizedPath(lang, link.path))}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
