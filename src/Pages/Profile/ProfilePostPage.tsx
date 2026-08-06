import { useEffect, useRef, useState } from "react";
import PostSkeleton from "../../Components/Community/PostSkeleton";
import ProfileContainer from "../../Components/Profile/ProfileMainContainer";
import useGetUserPosts from "../../Hooks/ProfileHooks/useGetUserPosts";
import type { Post } from "../../Types/Post";
import BounceLoading from "../../Components/shared/BounceLoading";
import PostCard from "../../Components/Community/PostCard";
import { useParams } from "react-router-dom";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Context/Auth";
import { deleteUserPost } from "../../Apis/ProfileApi/profile-api";
import DeletePostDialog from "../../Components/Profile/DeletePostDialog";
import cn from "../../utils/Cn";
import { useLocale } from "../../i18n/useLocale";

function ProfilePostPage() {
  const lastPost = useRef<HTMLDivElement>(null);
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [settingsOpen, setSettingsOpen] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean | null>(null);
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const {lang} =useLocale();
  const { id: userId } = useParams() as { id: string };

  const {user}= useAuth();
  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useGetUserPosts(userId);

  const handleDelete = async(id: string) => {

    try{
      if(!id) return;
      setDeleteLoading(true);
      await deleteUserPost({postId: id});
      const newPosts = postsData.filter((p) => p.id !== id);
      setPostsData(newPosts);
      
    }
    catch(err){
      console.log(err);
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

  // Update postsData when new data is fetched
  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page: any) => page.posts);
      setPostsData(allPosts);
      console.log("loading");
      if (isFetching) {
      }
    }
  }, [data]);

  return (
    <ProfileContainer tab="posts" key={userId}>
      <div className="flex flex-col gap-5">
        {postsData.map((p: Post) => (
          <div key={p.id} className="flex gap-1">
            <PostCard key={p.id} post={p} />
            {userId === user?.id && (
              <div
                key={p.id}
                onClick={() =>
                  setSettingsOpen((prev) => (prev === p.id ? null : p.id))
                }
                className="p-2 bg-white rounded-full h-fit hover:cursor-pointer hover:shadow-2xs hover:opacity-80 transition-all duration-300 relative"
              >
                <MoreHorizontal />
                {settingsOpen === p.id && (
                  <div className={cn(`absolute top-11 z-20 `, lang === "en" ? "right-0" : "left-0")}>
                    <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 z-20">
                      <button 
                      onClick={() => {
                        setDeleteOpen(true);
                        setDeleteId(p.id);
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
          <div className="flex flex-col gap-5 ">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
            {/* ping loading */}
            <BounceLoading />
          </div>
        )}
        <div ref={lastPost} />
      </div>
      {deleteOpen && (
        <DeletePostDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={() => handleDelete(deleteId)} loading={deleteLoading} />
      )} 
    </ProfileContainer> 
  );
}

export default ProfilePostPage;


