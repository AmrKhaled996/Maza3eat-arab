import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReplyItem from "../../Components/Comments/ReplyItem";
import { useLocation, useNavigate } from "react-router-dom";
import type { Reply } from "../../Types/Reply";
import HomeQandAPostsAdvertisement from "../../Components/Home/Q&ASection/Advertisement";
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

  const state = location.state as { reply: Reply; postId: string } | undefined;

  if (!state) {
    navigate(-1);
    return null;
  }

  const { reply, postId } = state;

  if (!state.reply) navigate(-1);

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
              <button
                onClick={() => {
                  navigate(localizedPath(lang, `post/${postId}`));
                }}
                className="rounded-full bg-stone-100 shadow-sm hover:bg-stone-200 transition-colors duration-300 hover:cursor-pointer  px-4 py-1 text-sm font-medium \ m-auto flex gap-2"
              >
                {t("comments.showDiscussion")}{" "}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Thread */}
            <div className="rounded-2xl">
              <ReplyItem reply={reply} showRepliesFlag={true} />
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
