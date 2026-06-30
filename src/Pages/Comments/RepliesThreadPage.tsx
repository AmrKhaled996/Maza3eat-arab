import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReplyItem from "../../Components/Comments/ReplyItem";
import { useLocation, useNavigate } from "react-router-dom";
import type { Reply } from "../../Types/Reply";
import HomeQandAPostsAdvertisement from "../../Components/Home/Q&ASection/Advertisement";
import QandAPopularQuestion from "../../Components/shared/PopularQuestion";

function RepliesThreadPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reply:Reply = state.reply;
  // const reply = {
  //   id: "0dd78c6c-4797-4851-80ce-04551898ec77",
  //   commentId: "66954a43-36bb-4124-9ef5-2d1ceb14ea18",
  //   content: "this is second reply on this comment",
  //   likesCount: 0,
  //   depth: 2,
  //   path: "1",
  //   createdAt: new Date(),
  //   author: {
  //     id: "d3d6f592-69a9-4b93-823e-cbd8e0f81f7b",
  //     name: "Ali Magdy",
  //     avatar:
  //       "https://lh3.googleusercontent.com/a/ACg8ocIae5etiTmWvSfoWULlWBVEj5b8vKs2PsUs4bID0axMZkIsNBE=s96-c",
  //     tier: {
  //       id: 1,
  //       name: "Basic",
  //       badgeColor: "#4bc302",
  //     },
  //   },
  //   hasReplies: false,
  //   likedByMe: false,
  //   permissions: {
  //     canDelete: false,
  //     canReport: true,
  //   },
  // };
  // const replies: Reply[] = state.replies;
  
  
  return (

      <div className="min-h-screen  max-w-7xl mx-auto">
        {/* ================= Page ================= */}
        <main className="mx-auto max-w-362.5 px-6 py-6">
          <div className="grid grid-cols-12 gap-4">
            {/* ================= Left Side ================= */}
            <section className="col-span-12 xl:col-span-7">
              {/* Back Button */}
              <div className="mb-6 flex">
                {/* <BackButton /> */}
                <button 
                onClick={()=>{navigate(-1)}}
                className="flex h-10 w-10 items-center justify-center rounded-full  bg-stone-100 shadow-sm hover:bg-stone-200 transition-colors duration-300 hover:cursor-pointer">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              {/* Show Discussion */}
                <button className="rounded-full bg-stone-100 shadow-sm hover:bg-stone-200 transition-colors duration-300 hover:cursor-pointer  px-4 py-1 text-sm font-medium \ m-auto flex gap-2">
                  Show Full Discussion <ArrowUpRight className="ml-2 h-4 w-4" />
                </button>
              </div>



              {/* Thread */}
              <div className="rounded-2xl">
                <ReplyItem reply={reply}  showRepliesFlag={true} />
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
