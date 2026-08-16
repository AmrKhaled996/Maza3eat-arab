import { useTranslation } from "react-i18next";
import HomeCommunitySectionCreateButton from "../shared/CreateButton";
import { useLocation } from "react-router-dom";



function SectionHeader({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { t } = useTranslation("common");
    const location = useLocation();
  return (
    <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 mb-5" key={location.pathname + location.search}>
      <div>
        <h2 className="text-fluid-section font-extrabold text-gray-900 text-safe">
          {t("CommunityMainPage.communityTitle")}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          {t("CommunityMainPage.communitySubtitle")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center justify-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-400">
            {t("CommunityMainPage.sortBy")}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value={"popular"}>{t("CommunityMainPage.popular")}</option>
            <option value={"latest"}>{t("CommunityMainPage.latest")}</option>
          </select>
        </div>
        <HomeCommunitySectionCreateButton />
      </div>
    </div>
  );
}

export default SectionHeader;
