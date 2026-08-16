import { QuestionCard } from "./QuestionCard";
import HomeQuestionsAdvertisement from "./Advertisement";
import HomeQandALayout from "./Layout";
import type { Question } from "../../../Types/Question";
import useHomeQuestions from "../../../Hooks/HomeHooks/useHomeQuestion";
import QandAPopularQuestion from "../../shared/PopularQuestion";
import HomeQandAPostsSectionMoreButton from "./MoreButton";
import QuestionCardSkeleton from "../../Q&A/QuestionCardSkeleton";
import type { Advertisement } from "../../../Types/Advertisement";

export default function QAForum({ ad }: { ad?: Advertisement }) {
  const { data: questions, isLoading } = useHomeQuestions();

  return (
    <HomeQandALayout>
      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions list */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {questions?.map((q: Question) => (
            <QuestionCard key={q.id} question={q} />
          ))}
          {isLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <QuestionCardSkeleton key={index} />
            ))}
        </div>

        {/* Sidebar — popular questions and the ad stick together as one block */}
        <div className="flex flex-col">
          <div className="sticky top-28 flex flex-col gap-5">
            {/* Popular Questions */}

            <QandAPopularQuestion limit={3} location={"home"} />

            {/* Sponsored */}
            {ad && <HomeQuestionsAdvertisement ad={ad} />}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <HomeQandAPostsSectionMoreButton />
    </HomeQandALayout>
  );
}
