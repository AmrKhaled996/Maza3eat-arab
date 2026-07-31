import { useEffect, useRef, useState } from "react";
import type { Post } from "../../Types/Post";
import PostCard from "../../Components/Community/PostCard";
import SearchHeroSection from "../../Components/Community/SearchHeroSection";

import { useCommuintySearch } from "../../Hooks/CommunityHooks/useCommunitySearch";
import PostSkeleton from "../../Components/Community/PostSkeleton";
import BounceLoading from "../../Components/shared/BounceLoading";
import MainPageLayout from "../../Components/Community/MainPageLayout";
import { useSearchParams } from "react-router-dom";
import SectionHeader from "../../Components/Community/SectionHeader";
import TrendingTags from "../../Components/shared/TrendingTags";

export default function CommunityMainPage() {
  const [sortBy, setSortBy] = useState("latest");
  const [searchValue, setSearchValue] = useState("");
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const lastPost = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get("search") || "";

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useCommuintySearch(searchParam, sortBy);

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

  const search = useSearchParams()[0].get("search") || "";
  useEffect(() => {
    refetch();
  }, [sortBy, searchValue, search]);

  useEffect(() => {
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

      {/* Main Grid Layout */}
      {/* Sidebar column must stretch to the row height so its sticky child can travel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Posts List Column */}
        <div className="lg:col-span-8 space-y-5">
          {postsData.map((p: Post) => (
            <PostCard key={p.id} post={p} />
          ))}
          {(isLoading || isFetchingNextPage) && (
            <div className="flex flex-col gap-5">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
              <BounceLoading />
            </div>
          )}
          <div ref={lastPost} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 hidden lg:block">
          <TrendingTags limit={10} />
        </div>
      </div>
    </MainPageLayout>
  );
}
