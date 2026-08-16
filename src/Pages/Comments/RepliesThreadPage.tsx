import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReplyItem from "../../Components/Comments/ReplyItem";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Reply } from "../../Types/Reply";
import HomeQandAPostsAdvertisement from "../../Components/Home/Q&ASection/AdvertisementReplies";
import QandAPopularQuestion from "../../Components/shared/PopularQuestion";
import NavigationBar from "../../Components/shared/NavigationBar";
import { localizedPath } from "../../i18n/paths";
import { useLocale } from "../../i18n/useLocale";
import { useTranslation } from "react-i18next";

function RepliesThreadPage() {
  const { lang } = useLocale();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const state = location.state as { reply: Reply; postId: string } | undefined;

  const reply = state?.reply;
  const postId = state?.postId;

  useEffect(() => {
    if (!reply && !id) {
      navigate(localizedPath(lang, ""), { replace: true });
    }
  }, [reply, id, lang, navigate]);

  return (
    <div className="min-h-screen  max-w-7xl mx-auto">
      <NavigationBar page="" solidNav={true} />
      {/* ================= Page ================= */}
      <main className="mx-auto max-w-362.5 px-6 py-6 mt-12">
        <div className="grid grid-cols-12 gap-4">
          {/* ================= Left Side ================= */}
          <section className="col-span-12 xl:col-span-7">
            {/* Back Button */}
            <div className="mb-6 flex">
              {/* <BackButton /> */}
              <button
                onClick={() => {
                  navigate(-1);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full  bg-stone-100 shadow-sm hover:bg-stone-200 transition-colors duration-300 hover:cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              {/* Show Discussion */}
              {postId && (
                <button
                  onClick={() => {
                    navigate(localizedPath(lang, `post/${postId}`));
                  }}
                  className="rounded-full bg-stone-100 shadow-sm hover:bg-stone-200 transition-colors duration-300 hover:cursor-pointer  px-4 py-1 text-sm font-medium \ m-auto flex gap-2"
                >
                  {t("comments.showDiscussion")}{" "}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>

            {/* Thread */}
            <div className="rounded-2xl">
              {reply ? (
                <ReplyItem reply={reply} showRepliesFlag={true} />
              ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#f7f7f7] px-6 py-10 text-center text-sm text-gray-600">
                  {lang === "ar"
                    ? "هذه المحادثة غير متاحة. ارجع إلى المنشور لعرض الردود."
                    : "This thread is unavailable. Go back to the post to view its replies."}
                </div>
              )}
            </div>
          </section>

          {/* ================= Right Sidebar ================= */}
          <aside className="col-span-12 xl:col-span-5 ">
            <div className="sticky top-24 flex justify-center flex-wrap gap-6 ">
              {/* Advertisement */}

              <HomeQandAPostsAdvertisement />

              {/* Popular Questions */}

              <QandAPopularQuestion limit={10} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default RepliesThreadPage;
