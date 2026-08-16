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

import { useAuth } from "../../Hooks/Auth";
import { useNotifications } from "../../Hooks/useNotifications";
import { Badge } from "./Tag";
import cn from "../../utils/Cn";
import Avatar from "./Avatar";

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
  const { user, isAuthenticated, logout } = useAuth();


  const { unreadCount } = useNotifications();
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
    navigate(`${nextPath}${search}${hash}`, { flushSync: true });
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
    window.location.reload();
  };
  useEffect(() => {
    setsearchval(searchP);
  }, [searchP]);

  useEffect(() => {
    const maxPageHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const handleScroll = () => {
      if (
        window.scrollY > 650 &&
        maxPageHeight >= window.scrollY &&
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
        className={`z-50 top-0 left-0 right-0  flex items-center justify-between px-6 sm:px-10 ${effectiveScrolled ? "fixed bg-white shadow-[0_1px_26px_-10px] navApperance" : "absolute "}   transition-all duration-700`}
      >
        <div
          onClick={()=>navigate(localizedPath(lang, ""))}
          className={`flex items-center gap-2 ${effectiveScrolled ? "" : "bg-white shadow-lg"} transition-colors  duration-700 rounded-b-2xl px-4 py-2 hover:cursor-pointer`}
        >
          <img
            src="/logo-v3.gif"
            alt="logo"
            className="w-16 h-16"
            loading="lazy"
            decoding="async"
          />
          <Link to={localizedPath(lang, "")} >
            <img
            src="/logo-new.png"
            alt="logo"
            className="w-16 h-16 "
            loading="lazy"
            decoding="async"
          />
          </Link>
        </div>

        <div
          className={`hidden sm:flex lg:gap-8 items-center gap-4 group mx-2`}
        >
          <Link
            to={localizedPath(lang, "featured")}
            className={cn(
              ` ${lang ==="ar"? "text-[14.5px] lg:text-md":"text-md"}  font-semibold nav-link-text group-hover:opacity-60 hover:opacity-100!  hover:scale-105 transition-all  drop-shadow `,
              handlePage("featured"),
            )}
          >
            {t("nav.featured")}
          </Link>
          <Link
            to={localizedPath(lang, "community")}
            className={cn(
              ` ${lang ==="ar"? "text-[14.5px] lg:text-md":"text-md"} font-semibold nav-link-text group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("community"),
            )}
          >
            {t("nav.community")}
          </Link>
          <Link
            to={localizedPath(lang, "q&a")}
            className={cn(
              ` ${lang ==="ar"? "text-[14.5px] lg:text-md":"text-md"} font-semibold nav-link-text group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("q&a"),
            )}
          >
            {t("nav.qna")}
          </Link>
          <Link
            to={localizedPath(lang, "about")}
            className={cn(
              ` ${lang ==="ar"? "text-[14.5px] lg:text-md":"text-md"} font-semibold nav-link-text group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
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
            aria-label={lang === "ar" ? "اللغة" : "Language"}
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
                    : page === "home"
                      ? "text-white hover:bg-white/20"
                      : "text-slate-800 hover:bg-white/20",
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
                    : page === "home"
                      ? "text-white hover:bg-white/20"
                      : "text-slate-800 hover:bg-white/20",
              )}
            >
              {t("lang.shortEn")}
            </button>
          </div>
          {scrolled &&
            (page === "community" || page === "q&a" || page === "featured") && (
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
                placeholder={t("nav.searchPlaceholder")}
                className="w-full  bg-white rounded-full ring-1 ring-primary px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 pr-12"
              />
            </div>
          )}
          {isAuthenticated && (
            <Link
              to={localizedPath(lang, "notifications")}
              className={`relative ${effectiveScrolled || page === "community" || page === "q&a" || page === "featured" ? "text-primary" : "text-white"} hover:opacity-80 hover:cursor-pointer transition-opacity`}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount.total.count > 0 && (
                <span className="absolute -top-1 -end-1 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {unreadCount.total.isCapped || unreadCount.total.count > 99 ? "99+" : unreadCount.total.count}
                </span>
              )}
            </Link>
          )}

          <div
            className="relative flex justify-center items-center"
            ref={profileWrapRef}
            onMouseEnter={() => isAuthenticated && setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            {isAuthenticated && user ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="rounded-full   shadow outline-2 outline-offset-0 transition-opacity hover:opacity-90 hover:cursor-pointer"
                  style={{ outlineColor: user.tier.badgeColor }}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <Avatar
                    src={user?.avatar || "https://i.pravatar.cc/40?img=12"}
                    name={user?.name}
                    className="h-9 w-9 rounded-full object-cover min-w-9"
                  />
                </button>
                {profileOpen && (
                  /* pt-2 (not mt-2) keeps the hover bridge between avatar and menu */
                  <div className="absolute end-0 top-full z-50 pt-2 min-w-50">
                  <div
                    className="rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                    role="menu"
                  >
                    <Link
                      to={localizedPath(lang, `profile/${user.id}`)}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("profileNav.menuProfile")}
                    </Link>
                    <Link
                      to={localizedPath(lang, "create-post")}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("createPost.menuCreatePost")}
                    </Link>
                    <Link
                      to={localizedPath(lang, "create-q&a")}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("home.qnaAsk")}
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full text-start px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-gray-50 hover:cursor-pointer transition-all duration-300"
                      onClick={async () => {
                        setProfileOpen(false);
                        await logout();
                        navigate(localizedPath(lang, "login"));
                      }}
                    >
                      {t("login.logout")}
                    </button>
                  </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                to={localizedPath(lang, "login")}
                className={`text-xs lg:text-sm font-semibold px-4 py-2 rounded-full transition-colors line-clamp-1 max-h-fit  ${
                  effectiveScrolled
                    ? "text-white border  hover:opacity-80 bg-linear-to-r from-secondary    to-accent"
                    : page === "home"
                      ? "text-white border border-white/50 hover:bg-white/10 "
                      : "text-primary border border-primary hover:bg-primary/5"
                }`}
              >
                {t("login.signInSignUp")}
              </Link>
            )}
          </div>

          {isAuthenticated && user && user.tier && (
            <div className="relative group">
              <Badge tier={user.tier.name} color={user.tier.badgeColor} />
              {user.tier.description && (
                <div className="absolute top-full mt-2 end-0 z-50 w-56 bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <p className="leading-relaxed">{user.tier.description}</p>
                  <div className="absolute -top-1 end-4 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className={`md:hidden ${effectiveScrolled || page === "community" || page === "q&a" || page === "featured" ? "text-primary" : "text-white"} hover:opacity-80 hover:cursor-pointer transition-opacity`}
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
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.about")}
          </Link>
          {isAuthenticated && (
            <Link
              to={localizedPath(lang, "notifications")}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5 flex items-center justify-between pb-3"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>{lang === "ar" ? "الإشعارات" : "Notifications"}</span>
              </span>
              {unreadCount.total.count > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount.total.isCapped || unreadCount.total.count > 99 ? "99+" : unreadCount.total.count}
                </span>
              )}
            </Link>
          )}
          {scrolled &&
            (page === "community" || page === "q&a" || page === "featured") && (
              <div className=" w-full p-2 mb-2 rounded-full  text-sm text-gray-700 placeholder-gray-400 ">
                <input
                  type="text"
                  value={searchval}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  onChange={(e) => setsearchval(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full  bg-white rounded-full ring-1 ring-primary px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 pr-12"
                />
              </div>
            )}

          {isAuthenticated && user ? (
            <>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center justify-between transition-opacity hover:opacity-90 hover:cursor-pointer"
                
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/40?img=12"}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover  mx-6 my-2  shadow outline-2 outline-offset-0"
                  style={{ outlineColor: user.tier.badgeColor }}
                />
                
              {isAuthenticated && user && user.tier && (
            <Badge tier={user.tier.name} color={user.tier.badgeColor} />
          )}
              </button>
              {profileOpen && (
                <div
                  className="absolute end-0 top-full z-50 mt-2 min-w-50 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                  role="menu"
                >
                  <Link
                    to={localizedPath(lang, `profile/${user.id}`)}
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    onClick={() => { setProfileOpen(false); setMenuOpen(false); }}
                  >
                    {lang === "ar" ? "ملفي الشخصي" : "My Profile"}
                  </Link>
                  <Link
                    to={localizedPath(lang, "create-post")}
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    onClick={() => { setProfileOpen(false); setMenuOpen(false); }}
                  >
                    {t("createPost.menuCreatePost")}
                  </Link>
                  <Link
                    to={localizedPath(lang, "create-q&a")}
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    onClick={() => { setProfileOpen(false); setMenuOpen(false); }}
                  >
                    {t("home.qnaAsk")}
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full text-start px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-gray-50"
                    onClick={async () => {
                      setProfileOpen(false);
                      setMenuOpen(false);
                      await logout();
                      navigate(localizedPath(lang, "login"));
                    }}
                  >
                    {t("login.logout")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to={localizedPath(lang, "login")}
              className={`text-sm lg:text-lg font-semibold w-fit m-auto px-8 py-2 rounded-full transition-colors line-clamp-1 max-h-fit  text-white border  hover:opacity-80 bg-linear-to-r from-secondary  to-accent  to-accenttext-white  border-white/50 hover:bg-white/10 `}
            >
              
              {t("login.signInSignUp")}
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default NavigationBar;
