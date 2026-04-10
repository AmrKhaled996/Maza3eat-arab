import { useTranslation } from "react-i18next";
import HomeCommunitySectionCreateButton from "../shared/CreateQuestionButton";
import { useLocale } from "../../i18n/useLocale";

function SectionHeader({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  return (
    <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 mb-5">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          {t("QandAMainPage.forumTitle")}
        </h2>
        <p className="text-sm text-gray-500 ">
          <br />
          {t("QandAMainPage.forumSubtitle")}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
          <span className="text-xs text-gray-400">
            {t("QandAMainPage.sortBy")}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value={"popular"}>{t("QandAMainPage.popular")}</option>
            <option value={"latest"}>{t("QandAMainPage.latest")}</option>
          </select>
        </div>
        <HomeCommunitySectionCreateButton />
      </div>
    </div>
  );
}

export default SectionHeader;
