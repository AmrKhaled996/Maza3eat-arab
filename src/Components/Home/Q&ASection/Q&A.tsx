import { QuestionCard } from "./QuestionCard";
import HomeQandAPostsAdvertisement from "./Advertisement";
import HomeQandAPostsSectionMoreButton from "./CreateButton";
import HomeQandAPopularQuestion from "./PopularQuestion";
import HomeQandALayout from "./Layout";
import type { Question } from "../../../Types/Question";
import useHomeQuestions from "../../../Hooks/HomeHooks/useHomeQuestion";

export default function QAForum() {
  const { data: questions } = useHomeQuestions();

  return (
    <HomeQandALayout>
      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions list */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {questions?.map((q: Question) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Popular Questions */}

          <HomeQandAPopularQuestion />

          {/* Sponsored */}
          <HomeQandAPostsAdvertisement />
        </div>
      </div>

      {/* Bottom CTA */}
      <HomeQandAPostsSectionMoreButton />
    </HomeQandALayout>
  );
}
