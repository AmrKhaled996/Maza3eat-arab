import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./Tag";
import cn from "../../utils/Cn";

function NavigationBar({ page }: { page: string }) {
  const [notifCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState<boolean>(false);

  const handlePage = (tape: string) => {
    if (page && page === "home") {
      return scrolled ? "gradient-text" : "text-white";
    }
    if (page && page === tape) {
      return scrolled ? "gradient-text" : "text-primary";
    } else {
      return scrolled
        ? "text-gray-500 hover:text-primary"
        : "text-gray-500 hover:text-primary";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 650 && window.scrollY < 2990) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={` top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 ${scrolled ? "fixed bg-white shadow-[0_1px_26px_-10px] " : "absolute "}   transition-all duration-700`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-2 ${scrolled ? "" : "bg-white shadow-lg"} transition-colors  duration-700 rounded-b-2xl px-8 py-4`}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2L17.5 7.5L24 6L22 12.5L28 16L22 19.5L24 26L17.5 24.5L14 30L10.5 24.5L4 26L6 19.5L0 16L6 12.5L4 6L10.5 7.5Z"
              fill="#2563eb"
            />
          </svg>
          <span
            className="font-extrabold text-lg tracking-tight"
            style={{ color: "#2563eb" }}
          >
            Loooogooo
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className={`hidden sm:flex lg:gap-8 items-center gap-4 group`}>
          <Link
            to="/featured"
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:opacity-100!  hover:scale-105 transition-all  drop-shadow `,
              handlePage("featured"),
            )}
          >
            منشورات مميزة
          </Link>
          <Link
            to="/cummunity"
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("cummunity"),
            )}
          >
            المجتمع
          </Link>
          <Link
            to="q&a"
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("q&a"),
            )}
          >
            سؤال و جواب
          </Link>
          <Link
            to="/about"
            className={cn(
              ` text-md font-semibold  group-hover:opacity-60 hover:scale-105 transition-all hover:opacity-100!  drop-shadow`,
              handlePage("about"),
            )}
          >
            حول
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Bell */}
          <button
            className={`relative ${scrolled ? "text-primary" : "text-white"} hover:opacity-80 hover:cursor-pointer transition-opacity`}
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
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="User"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow outline-2 hover:opacity-80 hover:cursor-pointer transition-opacity"
            style={{ outlineColor: "#FFD700" }}
          />

          {/* Gold badge */}
          <Badge tier="Gold" color=" #FFD700" />
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden ${scrolled ? "text-primary" : "text-white"} hover:opacity-80 hover:cursor-pointer transition-opacity`}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`${scrolled ? "fixed " : "absolute "}  top-20 left-4 right-4 z-40 bg-white rounded-2xl shadow-xl p-5 flex flex-col `}
        >
          <Link
            to="/featured"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
          >
            منشورات مميزة
          </Link>
          <Link
            to="/cummunity"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
          >
            المجتمع
          </Link>
          <Link
            to="q&a"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5"
          >
            سؤال و جواب
          </Link>
          <Link
            to="/about"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors py-1.5 pb-3"
          >
            حول
          </Link>

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
