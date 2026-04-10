import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";

function SearchHeroSection({
  searchValue,
  setSearchValue,
  searchLoading,
  setSearchLoading,
}: {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchLoading: boolean;
  setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const search= searchParams.get("search") || "";
  const [searchval, setsearchval] = useState<string>(search);

  const handleSearch = () => {
  
    setSearchValue(searchval);
   const params = new URLSearchParams(searchParams); // clone current params

    const trimmed = searchval.trim();

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    setSearchLoading(true);
    setSearchParams(params);
  };

  useEffect(() => {
  setsearchval(search);
}, [search]);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center ">
      {/* Hero heading */}
      <div className="text-center mb-10 ">
        <h1 className="text-4xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          {t("QandAMainPage.subtitle").split("\n")[0]}
          <br />
           {t("QandAMainPage.subtitle").split("\n")[1]}
        </h1>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-xl mx-auto mb-12">
        <input
          type="text"
          value={searchval}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          onChange={(e) => setsearchval(e.target.value)}
          placeholder={t("QandAMainPage.searchPlaceholder")}
          className="w-full bg-white rounded-full ring-1 ring-primary px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 pr-12"
        />
        <button
          onClick={() => handleSearch()}
          className={`absolute -translate-y-1/2 ${lang === "en" ? "right-3" : "left-3"} top-1/2 main-gradient  w-8 h-8 rounded-full flex items-center justify-center text-white shadow hover:cursor-pointer`}
        >
          {searchLoading ? (
            <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
          ) : (
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>)}
        </button>
      </div>
    </div>
  );
}

export default SearchHeroSection;
