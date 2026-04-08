import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import X from "../../assets/images/icons/X";
import FacebookIcon from "../../assets/images/icons/Facebook";
import InstagramIcon from "../../assets/images/icons/Instagram";
import LinkedinIcon from "../../assets/images/icons/LinkedIn";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

function Footer() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-screen overflow-hidden ">
      {!loaded && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover blur-sm"
        >
          <source src="/FooterSmall.mp4" type="video/mp4" />
        </video>
      )}

      <video
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setLoaded(true)}
        className={`absolute w-full h-full object-cover transition-opacity duration-700  ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/Footer.mp4" type="video/mp4" />
      </video>
      <footer className="absolute object-cover bottom-0 z-20 w-full  text-gray-200 px-8 py-8">
        <div className="bg-transparent text-slate-800 py-6 text-center z-10  h-full p-auto w-full my-30">
          <p className="text-5xl text-white font-bold">
            {t("footer.taglineTitle")}
          </p>
          <p className="text-2xl text-white/80 mt-8">
            {t("footer.taglineSubtitle")}
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              {t("footer.contact")}
            </h2>
            <p className="mb-2 hover:text-white transition ">
              amrXXXXXXXX.com
            </p>
            <p className="hover:text-white transition">0XXXXXXXXX</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              {t("footer.pages")}
            </h2>
            <ul className="flex flex-col gap-2 text-gray-300">
              <Link
                to={localizedPath(lang, "featured")}
                className="hover:text-white transition"
              >
                {t("nav.featured")}
              </Link>
              <Link
                to={localizedPath(lang, "community")}
                className="hover:text-white transition"
              >
                {t("nav.community")}
              </Link>
              <Link
                to={localizedPath(lang, "q&a")}
                className="hover:text-white transition"
              >
                {t("nav.qna")}
              </Link>
              <Link
                to={localizedPath(lang, "about")}
                className="hover:text-white transition "
              >
                {t("nav.about")}
              </Link>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              {t("footer.follow")}
            </h2>
            <div className="flex gap-4 text-2xl">
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40">
                <FacebookIcon />
              </span>
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40">
                <InstagramIcon />
              </span>
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40">
                <X />
              </span>
              <span className="hover:text-white transition-transform  cursor-pointer hover:scale-110 duration-300 ease-out hover:drop-shadow-sm hover:drop-shadow-white/40 ">
                <LinkedinIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mb-2 mt-10 text-center text-sm text-gray-400"></div>
        <div className=" text-slate-800 py-2 text-center   w-full">
          <p>
            &copy; {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
