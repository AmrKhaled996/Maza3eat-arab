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
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = useCommuintySearch(searchParam, sortBy);
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

  // Refetch when sortBy, searchValue, or search changes
  const search = useSearchParams()[0].get("search") || "";
  useEffect(() => {
    refetch();
  }, [sortBy, searchValue, search]);

  // Update searchLoading state based on isFetching
  useEffect(() => {
    console.log("fetching");
    if (isFetchingNextPage||isLoading) return;
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
            <BounceLoading />
          </div>
        )}
        <div ref={lastPost} />
      </div>
    </MainPageLayout>
  );
}
