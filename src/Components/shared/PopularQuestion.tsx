import useHomePopularQuestions from "../../Hooks/HomeHooks/useHomePopular";
import type { Question } from "../../Types/Question";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
function QandAPopularQuestion({ limit }: { limit: number }) {
  const navigate = useNavigate(); 
  const { t } = useTranslation("common");
  const {lang} =useLocale(); 
  const {
    data: popularQuestions,
  } = useHomePopularQuestions(limit);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 sticky top-28">
      <h3 className="font-bold text-gray-900 mb-4 text-base">
        {t("home.qnaPopularTitle")}
      </h3>
      {popularQuestions && (
        <div className="flex flex-col gap-4">
          {popularQuestions.map((popularQuestion: Question ,index:number) => (
            <div key={popularQuestion?.id}
            onClick={() => {navigate(localizedPath(lang, `q&a?search=${encodeURIComponent(popularQuestion?.title || "")}` ))}} className="cursor-pointer group">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                {popularQuestion?.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t("home.answerCount", {
                  count: popularQuestion?.answersCount ?? 0,
                })}
              </p>
              {index < popularQuestions.length - 1 && <hr className="border-t border-gray-100 mt-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QandAPopularQuestion;
