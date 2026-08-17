import { useEffect, useRef, useState } from "react";
import ProfileContainer from "../../Components/Profile/ProfileMainContainer";
import useGetQuestionsPosts from "../../Hooks/ProfileHooks/useGetUserQuestions";
import type { Question } from "../../Types/Question";
import { QuestionCard } from "../../Components/Q&A/QuestionCard";
import BounceLoading from "../../Components/shared/BounceLoading";
import { useParams } from "react-router-dom";
import QuestionCardSkeleton from "../../Components/Q&A/QuestionCardSkeleton";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { useAuth } from "../../Context/Auth";
import { MoreHorizontal, Trash2 } from "lucide-react";
import cn from "../../utils/Cn";
import DeleteQuestionDialog from "../../Components/Profile/DeleteQuestionDialog";
import { deleteUserQuestion } from "../../Apis/ProfileApi/profile-api";

function ProfileQandAPage() {
  const [QuestionsData, setQuestionsData] = useState<Question[]>([]);

  const [settingsOpen, setSettingsOpen] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean | null>(null);
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const {lang} =useLocale();
  const { id: userId } = useParams() as { id: string };

  const {user}= useAuth();

  const lastPost = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetQuestionsPosts(userId);

    const handleDelete = async(id: string) => {
  
      try{
        if(!id) return;
        setDeleteLoading(true);
        await deleteUserQuestion({questionId: id});
        const newQuestions = QuestionsData.filter((q) => q.id !== id);
        setQuestionsData(newQuestions);
        
      }
      catch(err){
        console.error(err);
      }
      finally{
        setDeleteLoading(false);
        setDeleteOpen(false);
      }
  
    };
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

    }
  }, [data]);
  return (
    <ProfileContainer tab="Q&A" key={userId}>
      <div className="flex flex-col gap-5">
        {QuestionsData.map((q: Question) => (
          <div key={q.id} className="flex gap-1">
            <div className="w-full">

            <QuestionCard key={q.id} question={q} />
            </div>
            {userId === user?.id && (
              <div
                key={q.id}
                onClick={() =>
                  setSettingsOpen((prev) => (prev === q.id ? null : q.id))
                }
                className="p-2 bg-white rounded-full h-fit hover:cursor-pointer hover:shadow-2xs hover:opacity-80 transition-all duration-300 relative"
              >
                <MoreHorizontal />
                {settingsOpen === q.id && (
                  <div className={cn(`absolute top-11 z-20 `, lang === "en" ? "right-0" : "left-0")}>
                    <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-20">
                      <button 
                      onClick={() => {
                        setDeleteOpen(true);
                        setDeleteId(q.id);
                      }}
                      className="text-red-500 hover:text-red-600 hover:cursor-pointer  hover:opacity-80 transition-all duration-300 flex items-center gap-2 z-20">
                        <Trash2 /> {t("profile.menuDelete")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {(isLoading || isFetchingNextPage) && (
          <div className="flex flex-col gap-5">
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />

            <BounceLoading />
          </div>
        )}
        <div ref={lastPost} />
      </div>
       {deleteOpen && (
        <DeleteQuestionDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => handleDelete(deleteId)} loading={deleteLoading} />
      )}
    </ProfileContainer>
  );
}

export default ProfileQandAPage;
