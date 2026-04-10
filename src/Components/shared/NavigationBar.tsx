import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import type { SupportedLocale } from "../../i18n/config";

import { Badge } from "./Tag";
import cn from "../../utils/Cn";

function NavigationBar({
  page,
  solidNav = false,
}: {
  page: string;
  solidNav?: boolean;
}) {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const profileWrapRef = useRef<HTMLDivElement>(null);

  const [notifCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const [searchBar, setsearchBar] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchP = searchParams.get("search") || "";
  const [searchval, setsearchval] = useState<string>(search);

  const effectiveScrolled = solidNav || scrolled;

  const goLocale = (next: SupportedLocale) => {
    const nextPath = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${next}`);
    navigate(`${nextPath}${search}${hash}`);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handlePage = (tape: string) => {
    if (page && page === "home") {
      return effectiveScrolled ? "gradient-text" : "text-white";
    }
    if (page && page === tape) {
      return effectiveScrolled ? "gradient-text" : "text-primary";
    }
    return effectiveScrolled
      ? "text-gray-500 hover:text-primary"
      : "text-gray-500 hover:text-primary";
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    const trimmed = searchval.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };
  useEffect(() => {
    setsearchval(searchP);
  }, [searchP]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY > 650 &&
        window.scrollY < 2990 &&
        page &&
        page === "home"
      ) {
        setScrolled(true);
      } else if (
        window.scrollY > 650 &&
        page &&
        (page === "community" || page === "q&a" || page === "featured")
      ) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        profileWrapRef.current &&
        !profileWrapRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [profileOpen]);

  return (
    <>
      <nav
        className={` top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 ${effectiveScrolled ? "fixed bg-white shadow-[0_1px_26px_-10px] navApperance" : "absolute "}   transition-all duration-700`}
      >
        <div
          className={`flex items-center gap-2 ${effectiveScrolled ? "" : "bg-white shadow-lg"} transition-colors  duration-700 rounded-b-2xl px-8 py-4`}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2L17.5 7.5L24 6L22 12.5L28 16L22 19.5L24 26L17.5 24.5L14 30L10.5 24.5L4 26L6 19.5L0 16L6 12.5L4 6L10.5 7.5Z"
              fill="#2563eb"
            />
          </svg>
          <Link to={localizedPath(lang, "")}>
            <span
              className="font-extrabold text-lg tracking-tight"
              style={{ color: "#2563eb" }}
            >
              Loooogooo
            </span>
          </Link>
        </div>

        <div className={`hidden sm:flex lg:gap-8 items-center gap-4 group`}>
          <Link
            to={localizedPath(lang, "featured")}
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:opacity-100!  hover:scale-105 transition-all  drop-shadow `,
              handlePage("featured"),
            )}
          >
            {t("nav.featured")}
          </Link>
          <Link
            to={localizedPath(lang, "community")}
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("community"),
            )}
          >
            {t("nav.community")}
          </Link>
          <Link
            to={localizedPath(lang, "q&a")}
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("q&a"),
            )}
          >
            {t("nav.qna")}
          </Link>
          <Link
            to={localizedPath(lang, "about")}
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("about"),
            )}
          >
            {t("nav.about")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div
            className={`flex rounded-full border px-1 py-0.5 text-xs font-bold ${effectiveScrolled ? "border-gray-200 bg-white" : "border-gray-200 bg-white/10"}`}
            role="group"
            aria-label={lang === "ar" ? "Language" : "اللغة"}
          >
            <button
              type="button"
              onClick={() => goLocale("ar")}
              className={cn(
                "rounded-full px-3 py-1 transition-colors ",
                lang === "ar"
                  ? "bg-primary text-white"
                  : effectiveScrolled
                     ? "text-gray-600 hover:bg-gray-100"
                    :page === "home" ? "text-white hover:bg-white/20":"text-slate-800 hover:bg-white/20",
              )}
            >
              {t("lang.shortAr")}
            </button>
            <button
              type="button"
              onClick={() => goLocale("en")}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                lang === "en"
                  ? "bg-primary text-white"
                  : effectiveScrolled 
                    ? "text-gray-600 hover:bg-gray-100"
                    :page === "home" ? "text-white hover:bg-white/20":"text-slate-800 hover:bg-white/20",
              )}
            >
              {t("lang.shortEn")}
            </button>
          </div>
          {(scrolled && (page === "community" || page === "q&a" || page === "featured")) && (
            <button
              onClick={() => setsearchBar(!searchBar)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow hover:cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          )}
          {searchBar && scrolled && (
            <div className="hidden md:flex absolute top-18 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white rounded-full p-1 text-sm text-gray-700 placeholder-gray-400 shadow-md">
              <input
                type="text"
                value={searchval}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                onChange={(e) => setsearchval(e.target.value)}
                placeholder="ماذا تريد أن ترى؟"
                className="w-full  bg-white rounded-full ring-1 ring-primary px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 pr-12"
              />
            </div>
          )}
          <button
            className={`relative ${effectiveScrolled ? "text-primary" : "text-white"} hover:opacity-80 hover:cursor-pointer transition-opacity`}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute -top-1 -inset-e-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          <div className="relative" ref={profileWrapRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="rounded-full ring-2 ring-white shadow outline-2 outline-offset-0 transition-opacity hover:opacity-90"
              style={{ outlineColor: "#FFD700" }}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
            </button>
            {profileOpen && (
              <div
                className="absolute inset-e-0 top-full z-50 mt-2 min-w-50 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                role="menu"
              >
                <Link
                  to={localizedPath(lang, "create-post")}
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  onClick={() => setProfileOpen(false)}
                >
                  {t("createPost.menuCreatePost")}
                </Link>
              </div>
            )}
          </div>

          <Badge tier="Gold" color=" #FFD700" />
        </div>

        <button
          className={`md:hidden ${effectiveScrolled ? "text-primary" : "text-white"} hover:opacity-80 hover:cursor-pointer transition-opacity`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          className={`${effectiveScrolled ? "fixed " : "absolute "}  top-20 left-4 right-4 z-40 bg-white rounded-2xl shadow-xl p-5 flex flex-col `}
        >
          <div className="flex gap-2 pb-3 border-b border-gray-100 mb-2">
            <button
              type="button"
              onClick={() => goLocale("ar")}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-bold",
                lang === "ar"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700",
              )}
            >
              {t("lang.shortAr")}
            </button>
            <button
              type="button"
              onClick={() => goLocale("en")}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-bold",
                lang === "en"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700",
              )}
            >
              {t("lang.shortEn")}
            </button>
          </div>
          <Link
            to={localizedPath(lang, "create-post")}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
            onClick={() => setMenuOpen(false)}
          >
            {t("createPost.menuCreatePost")}
          </Link>
          <Link
            to={localizedPath(lang, "featured")}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.featured")}
          </Link>
          <Link
            to={localizedPath(lang, "community")}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.community")}
          </Link>
          <Link
            to={localizedPath(lang, "q&a")}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.qna")}
          </Link>
          <Link
            to={localizedPath(lang, "about")}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5 pb-3"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.about")}
          </Link>
          {(scrolled && (page === "community" || page === "q&a" || page === "featured")) && (
            <div className=" w-full p-2 mb-2 rounded-full  text-sm text-gray-700 placeholder-gray-400 ">
              <input
                type="text"
                value={searchval}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                onChange={(e) => setsearchval(e.target.value)}
                placeholder="ماذا تريد أن ترى؟"
                className="w-full  bg-white rounded-full ring-1 ring-primary px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 pr-12"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
              }}
            >
              Gold
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default NavigationBar;
