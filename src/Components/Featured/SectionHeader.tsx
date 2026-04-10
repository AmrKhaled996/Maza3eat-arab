import HomeCommunitySectionCreateButton from "../shared/CreateButton";

function SectionHeader({ sortBy, setSortBy }: { sortBy: string; setSortBy: React.Dispatch<React.SetStateAction<string>> }) {
    return (       <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            منشورات المجتمع
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            شارك تجاربك وتواصل مع المسافرين
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            <span className="text-xs text-gray-400">ترتيب حسب</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={"popular"}>الأكثر شيوعاً</option>
              <option value={"latest"}>الأحدث</option>
            </select>
          </div>
          <HomeCommunitySectionCreateButton/>
        </div>
      </div> );
}

export default SectionHeader;