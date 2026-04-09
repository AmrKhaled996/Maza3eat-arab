export function CommunityMainPage() {
  return (
    <>
      <TravelPostsAR />
    </>
  );
}

// export default CommunityMainPage;

import { useEffect, useRef, useState } from "react";
import type { Post } from "../../Types/Post";

import PostCard from "../../Components/Community/PostCard";
import SearchHeroSection from "../../Components/Community/SearchHeroSection";
import NavigationBar from "../../Components/shared/NavigationBar";
import HomeCommunitySectionCreateButton from "../../Components/shared/CreateButton";
import { Title } from "react-head";
import {
  useCommuintySearch,

} from "../../Hooks/CommunityHooks/useCommunitySearch";

import PostSkeleton from "../../Components/Community/PostSkeleton";

export default function TravelPostsAR() {
  const [sortBy, setSortBy] = useState("latest");
  const [searchValue, setSearchValue] = useState("");
  const [postsData, setPostsData] = useState<Post[]>([]);


  const lastPost = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get("search") || "";

  const { data, isLoading, error ,isFetchingNextPage,fetchNextPage ,refetch } = useCommuintySearch(
    searchParam,
    sortBy,
  );

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

  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page: any) => page.posts);
      setPostsData(allPosts);
    }
  }, [data]);

  useEffect(() => {

    refetch();
    if (data) {
      const allPosts = data.pages.flatMap((page: any) => page.posts);
      setPostsData(allPosts);
    }
  }, [sortBy, searchValue, data]);
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Title>المجتمع - مزاعيط العرب</Title>
        <SearchHeroSection
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <NavigationBar page="community" />
        {/* Section header */}
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              منشورات المجتمع
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              شارك تجاربك وتواصل مع المسافرين
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
              <span className="text-xs text-gray-400">ترتيب حسب</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option>الأكثر شيوعاً</option>
                <option>الأحدث</option>
                <option>الأعلى تقييماً</option>
              </select>
            </div>
            <HomeCommunitySectionCreateButton />
          </div>
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-5">
          {postsData.map((p: Post) => (
            <PostCard key={p.id} post={p} />
          ))}
          {(isLoading || isFetchingNextPage) && (
            <div className="flex flex-col gap-5">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
              {/* ping loading */}
              <div className="flex justify-center items-center gap-3 ">
                <div className="animate-[bounce_1s_infinite_100ms] rounded-full h-4 w-4 bg-gray-300"></div>
                <div className="animate-[bounce_1s_infinite_300ms] rounded-full h-4 w-4 bg-gray-300"></div>
                <div className="animate-[bounce_1s_infinite_500ms] rounded-full h-4 w-4 bg-gray-300"></div>
              </div>
            </div>
          )}
          <div ref={lastPost} />
        </div>
      </div>
    </div>
  );
}
