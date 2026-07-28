import { useEffect, useRef, useState } from "react";
import ProfileContainer from "../../Components/Profile/ProfileMainContainer";
import useGetQuestionsPosts from "../../Hooks/ProfileHooks/useGetUserQuestions";
import type { Question } from "../../Types/Question";
import { QuestionCard } from "../../Components/Q&A/QuestionCard";
import BounceLoading from "../../Components/shared/BounceLoading";
import { useParams } from "react-router-dom";

function ProfileQandAPage() {
  const [QuestionsData, setQuestionsData] = useState<Question[]>([]);

    const {id:userId} = useParams() as {id: string};

  const lastPost = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams(window.location.search);

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useGetQuestionsPosts(userId);
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
  return (
    <ProfileContainer tab="q&a">
      <div className="flex flex-col gap-5">
        {QuestionsData.map((q: Question) => (
          <QuestionCard key={q.id} question={q} />
        ))}
        {(isLoading || isFetchingNextPage) && (
          <div className="flex flex-col gap-5">
            {/* <Questionskeleton />
            <Questionskeleton />
            <Questionskeleton /> */}

            <BounceLoading />
          </div>
        )}
        <div ref={lastPost} />
      </div>
    </ProfileContainer>
  );
}

export default ProfileQandAPage;
