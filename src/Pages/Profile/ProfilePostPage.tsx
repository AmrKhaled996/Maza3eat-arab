import { useEffect, useRef, useState } from "react";
import PostSkeleton from "../../Components/Community/PostSkeleton";
import ProfileContainer from "../../Components/Profile/ProfileMainContainer";
import useGetUserPosts from "../../Hooks/ProfileHooks/useGetUserPosts";
import type { Post } from "../../Types/Post";
import BounceLoading from "../../Components/shared/BounceLoading";
import PostCard from "../../Components/Community/PostCard";
import { useParams } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

function ProfilePostPage() {
    const lastPost = useRef<HTMLDivElement>(null);
    const [postsData, setPostsData] = useState<Post[]>([]);
    const [settingsOpen, setSettingsOpen] = useState<string | null>(null);

      const {id:userId} = useParams() as {id: string};

      const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        isFetching,
        refetch,
      } = useGetUserPosts(userId); 

      const handleDelete = (id: string) => {
        
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
      

    return ( <ProfileContainer tab="posts">

              <div className="flex flex-col gap-5">
                {postsData.map((p: Post) => (
                  <div key={p.id} className="flex gap-1">
                  <PostCard key={p.id} post={p} />
                  <div key={p.id}
                  onClick={()=>setSettingsOpen(prev => (prev === p.id ? null : p.id))}
                  className="p-2 bg-white rounded-full h-fit hover:cursor-pointer hover:shadow-2xs hover:opacity-80 transition-all duration-300 relative">
                    <MoreHorizontal />
                    {
                      settingsOpen === p.id && (
                        <div className="absolute top-11 right-0">
                          <div className="bg-white rounded-lg shadow-md p-2 flex flex-col gap-2">
                            <button className="text-red-500 hover:text-red-600 hover:cursor-pointer hover:shadow-2xs hover:opacity-80 transition-all duration-300">حذف</button>
                          </div>
                        </div>
                      )
                    }
                  </div>
                  </div>

                ))}
                {(isLoading || isFetchingNextPage) && (
                  <div className="flex flex-col gap-5">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                    {/* ping loading */}
                    <BounceLoading />
                  </div>
                )}
                <div ref={lastPost} />
              </div>
    </ProfileContainer> );
}

export default ProfilePostPage;