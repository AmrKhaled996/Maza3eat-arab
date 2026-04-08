import useHomePopularQuestions from "../../../Hooks/HomeHooks/useHomePopular";
import type { Question } from "../../../Types/Question";

function HomeQandAPopularQuestion() {
  const {
    data: popularQuestions,
    isLoading: popularQuestionsLoading,
    error: popularQuestionsError,
  } = useHomePopularQuestions();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 text-base">
        الاسالة الشائعة
      </h3>
      {popularQuestions && (
        <div className="flex flex-col gap-4">
          {popularQuestions.map((popularQuestion: Question) => (
            <div key={popularQuestion?.id} className="cursor-pointer group">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                {popularQuestion?.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {popularQuestion?.answersCount} اجابة
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeQandAPopularQuestion;
