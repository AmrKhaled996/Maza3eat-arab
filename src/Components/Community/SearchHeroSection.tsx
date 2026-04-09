import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function SearchHeroSection({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchval, setsearchval] = useState<string>("");

  const handleSearch = () => {
    setSearchValue(searchval);
    const params = new URLSearchParams(searchValue);

    const trimmed = searchval;

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center ">
      {/* Hero heading */}
      <div className="text-center mb-10 ">
        <h1 className="text-4xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          شارك تجربة سفرك
          <br />
          على شكل قصة
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
          placeholder="ماذا تريد أن ترى؟"
          className="w-full bg-white rounded-full ring-1 ring-primary px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 pr-12"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute left-3 top-1/2 main-gradient -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow hover:cursor-pointer"
        >
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
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchHeroSection;
