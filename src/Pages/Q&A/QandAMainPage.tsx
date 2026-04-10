import { useEffect, useRef, useState } from "react";
import type { Question } from "../../Types/Question";
import { useSearchParams } from "react-router-dom";
import MainPageLayout from "../../Components/Q&A/MainPageLayout";
import SearchHeroSection from "../../Components/Q&A/SearchHeroSection";
import SectionHeader from "../../Components/Q&A/SectionHeader";
import BounceLoading from "../../Components/shared/BounceLoading";
import { useQuestionsSearch } from "../../Hooks/Q&AHooks/useQuestionSearch";
import { QuestionCard } from "../../Components/Q&A/QuestionCard";
import QandAPopularQuestion from "../../Components/shared/PopularQuestion";

function QandAMainPage() {
  const [sortBy, setSortBy] = useState("latest");
  const [searchValue, setSearchValue] = useState("");
  const [QuestionsData, setQuestionsData] = useState<Question[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const lastPost = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get("search") || "";

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useQuestionsSearch(searchParam, sortBy);
  // Infinite scrolling with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (lastPost.current) observer.observe(lastPost.current);

    return () => {
      if (lastPost.current) observer.unobserve(lastPost.current);
    };
  }, [fetchNextPage]);

  // Update QuestionsData when new data is fetched
  useEffect(() => {
    if (data) {
      const allQuestions = data.pages.flatMap((page: any) => page.questions);
      setQuestionsData(allQuestions);
      console.log("loading");
      if (isFetching) {
      }
    }
  }, [data]);

  // Refetch when sortBy, searchValue, or search changes
  const search = useSearchParams()[0].get("search") || "";
  useEffect(() => {
    refetch();
  }, [sortBy, searchValue, search]);

  // Update searchLoading state based on isFetching
  useEffect(() => {
    console.log("fetching");
    if (isFetchingNextPage || isLoading) return;
    setSearchLoading(isFetching);
  }, [isFetching]);
  return (
    <MainPageLayout>
      <SearchHeroSection
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchLoading={searchLoading}
        setSearchLoading={setSearchLoading}
      />

      {/* Section header */}
      <SectionHeader sortBy={sortBy} setSortBy={setSortBy} />

      {/* Questions */}
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-5 col-span-2">
          {QuestionsData.map((q: Question) => (
            <QuestionCard key={q.id} question={q} />
          ))}
          {/* {(isLoading || isFetchingNextPage) && (
          <div className="flex flex-col gap-5">
            <Questionskeleton />
            <Questionskeleton />
            <Questionskeleton />

            <BounceLoading />
            </div>
        )} */}
          <div ref={lastPost} />
        </div>
        <QandAPopularQuestion limit={10} />
      </div>
    </MainPageLayout>
  );
}

export default QandAMainPage;
