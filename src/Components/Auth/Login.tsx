import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/Auth";
import { useState } from "react";

export default function Login() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const { login } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsRedirecting(true);
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4">
        <Link
          to={localizedPath(lang, "login")}
          className="text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
        >
          {t("login.signInSignUp")}
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
          {/* Left side — Image */}
          <div className="hidden md:block md:w-1/2 relative">
            <div className="absolute inset-2 rounded-2xl overflow-hidden border-4 border-sky-400/60 shadow-lg">
              <img
                src="/LoginImage.png"
                alt={t("login.imageAlt")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side — Auth content */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-between py-12 px-8 relative overflow-hidden">
            {/* Airplane dashed path decoration */}
            <div className="absolute top-6 right-8 w-48 h-24 pointer-events-none">
              <svg
                viewBox="0 0 200 100"
                fill="none"
                className="w-full h-full"
              >
                <path
                  d="M10 80 Q 60 10, 120 40 T 190 15"
                  stroke="url(#dashGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <defs>
                  <linearGradient
                    id="dashGrad"
                    x1="0"
                    y1="0"
                    x2="200"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <img
                src="/airplane.svg"
                alt=""
                className="absolute -top-1 left-12 w-7 h-7 -rotate-30"
              />
            </div>

            {/* Welcome text */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <h1 className="text-4xl md:text-5xl font-extrabold gradient-text italic">
                {t("login.welcome")}
              </h1>

              {/* Logo */}
              <div className="flex items-center gap-2 mt-2">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 2L17.5 7.5L24 6L22 12.5L28 16L22 19.5L24 26L17.5 24.5L14 30L10.5 24.5L4 26L6 19.5L0 16L6 12.5L4 6L10.5 7.5Z"
                    fill="#2563eb"
                  />
                </svg>
                <span className="font-extrabold text-xl text-primary tracking-tight">
                  Loooogooo
                </span>
              </div>
            </div>

            {/* Google Sign-in Button */}
            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
              <button
                onClick={handleGoogleLogin}
                disabled={isRedirecting}
                className="group relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-full 
                  bg-gradient-to-r from-primary/90 via-secondary/80 to-secondary/90
                  hover:from-primary hover:via-secondary hover:to-secondary
                  text-white font-bold text-base shadow-lg hover:shadow-xl 
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isRedirecting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="shrink-0"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#fff"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#fff"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#fff"
                      fillOpacity="0.6"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#fff"
                      fillOpacity="0.9"
                    />
                  </svg>
                )}
                <span>{t("login.googleSignIn")}</span>
              </button>
            </div>

            {/* Bottom decorative landmarks */}
            <div className="flex items-end justify-center gap-8 w-full mt-auto pt-8">
              <img
                src="/mosque.svg"
                alt=""
                className="h-16 md:h-20 opacity-80"
              />
              <img
                src="/Bridge.svg"
                alt=""
                className="h-14 md:h-18 opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
