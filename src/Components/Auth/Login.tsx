import { useTranslation } from "react-i18next";
import { useAuth } from "../../Hooks/Auth";
import { useState } from "react";
import { localizedPath } from "../../i18n/paths";
import { Link, useNavigate } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";

export default function Login() {
  const { t } = useTranslation("common");
  const {lang}=useLocale();
  const navigate =useNavigate();
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

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full  flex shadow-2xl bg-white min-h-screen">
          {/* Left side — Image */}
          <div className="hidden md:block md:w-1/2 relative h-screen">
            <div className="w-full h-full inset-2  shadow-lg object-fill">
              <img
                src="/LoginImage.png"
                alt={t("login.imageAlt")}
                className="w-full h-full object-fill shadow-lg"
                
              />
            </div>
          </div>

          {/* Right side — Auth content */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-between py-2 px-8 relative overflow-hidden">
            {/* Airplane dashed path decoration */}
              <img
                src="/airplane.svg"
                alt=""
                className="absolute right-0 top-0 w-30 h-30 pointer-events-none"
              />
            {/* Welcome text */}
            <div className="flex flex-col items-center gap-5 mt-8">
              <h1 className="p-5 text-4xl md:text-5xl font-extrabold gradient-text italic">
                {t("login.welcome")}
              </h1>

              {/* Logo */}
              <div
                        onClick={()=>navigate(localizedPath(lang, ""))}
                        className={`flex items-center gap-2 transition-colors duration-700 rounded-b-2xl px-4 py-2 hover:cursor-pointer mt-8`}
                      >
                        <img
                          src="/logo-v3.gif"
                          alt="logo"
                          className="w-25 h-25"
                          loading="lazy"
                          decoding="async"
                        />
                        <Link to={localizedPath(lang, "")} >
                          <img
                          src="/logo-new.png"
                          alt="logo"
                          className="w-25 h-25 "
                          loading="lazy"
                          decoding="async"
                        />
                        </Link>
                      </div>
            </div>

            {/* Google Sign-in Button */}
            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
              <button
                onClick={handleGoogleLogin}
                disabled={isRedirecting}
                className="group relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-full hover:cursor-pointer hover:opacity-80  
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
            <div className="flex items-end justify-center gap-12 w-full pt-8">
              <img
                src="/Bridge.svg"
                alt=""
                className="h-10 opacity-80"
              />
                          <img
                src="/mosque.svg"
                alt=""
                className="h-16 md:h-20 opacity-80"
              />
              <img
                src="/Bridge.svg"
                alt=""
                className="h-10 opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
