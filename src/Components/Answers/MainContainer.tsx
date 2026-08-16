import { useEffect, useRef, useState } from "react";
import type { Answer as AnswerType } from "../../Types/Answer";
import AnswerInput from "./AnswerInput";
import AnswerItem from "./AnswerItems";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useGetAnswersByPostId from "../../Hooks/AnswerHooks/useGetAnswersByPostId";
import { useAuth } from "../../Context/Auth";

export default function AnswersSection() {
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  // const [newAnswer, setNewAnswer] = useState<Answer>();
  const { user } = useAuth();
  const { id: questionIdparam } = useParams<{ id: string }>();
  const lastAnswerRef = useRef<HTMLDivElement>(null);
  const [nextCursor, setNextCursor] = useState("");
  const HighlightedAnswer = useLocation().state?.answer;
  const [searchParams] = useSearchParams();

  const HighlightedAnswerID = searchParams.get("highlighted") || "";



  const { data, isLoading, isFetchingNextPage, fetchNextPage, isFetching } =
    useGetAnswersByPostId(questionIdparam ?? "", nextCursor, HighlightedAnswerID);



  const handleAddAnswer = (answer: AnswerType) => {
    setAnswers((prev) => [answer, ...prev]);
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        console.log("is fetching answers");
        fetchNextPage();
      }
    });

    if (lastAnswerRef.current) observer.observe(lastAnswerRef.current);

    return () => {
      if (lastAnswerRef.current) observer.unobserve(lastAnswerRef.current);
    };
  }, [fetchNextPage]);

  useEffect(() => {
    if (data) {
      const allAnswers = data.pages.flatMap((page: any) => page?.answers);
      setAnswers(allAnswers);
      setNextCursor(data?.pages[data?.pages.length - 1]?.nextCursor);
      console.log("loading");
    }
  }, [data]);

  if (!questionIdparam) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6" dir="rtl">
      {user && (
        <div className="w-full">
          <AnswerInput onAddAnswer={handleAddAnswer} />
        </div>
      )}

      <div className="flex flex-col gap-5 max-w-2xl">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonAnswer key={index} />
          ))
        ) : (
          <div>
            {HighlightedAnswer && <AnswerItem key={HighlightedAnswer?.id} answer={HighlightedAnswer} />}
            {answers?.map((c, idx) => (
              <AnswerItem key={c.id} answer={c} isFirst={idx === 0} />
            ))}
          </div>
        )}
        {isFetchingNextPage && (
          <div className="flex flex-col gap-3 animate-pulse">
            <SkeletonAnswer indent />
            <SkeletonAnswer indent />
            <SkeletonAnswer indent />
          </div>
        )}
        <div ref={lastAnswerRef} className="w-full h-3"></div>
      </div>
    </div>
  );
}

function SkeletonAnswer({ indent = false }) {
  return (
    <div className={`flex gap-3 animate-pulse ${indent ? "mr-10" : ""}`}>
      <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2 items-center">
          <div className="h-3 w-24 bg-gray-200 rounded-full" />
          <div className="h-3 w-12 bg-gray-200 rounded-full" />
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full" />
        <div className="h-3 w-3/4 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
