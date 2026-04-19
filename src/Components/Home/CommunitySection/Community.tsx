import useHomePosts from "../../../Hooks/HomeHooks/useHomePosts";
import type { Post } from "../../../Types/Post";
import HomeCommunitySectionAdd from "../../shared/Advertisement";
import HomeCommunitySectionBigCard from "./BigCard";
import HomeCommunitySectionBigCardSkeleton from "./BigCardSkeleton";
import HomeCommunitySectionLayout from "./Layout";
import HomeCommunitySectionMoreButton from "./MoreButton";
import HomeCommunitySectionSmallCard from "./SmallCard";
import HomeCommunitySectionSmallCardSkeleton from "./smallCardSkeleton";
import PostTrendingTopicsSection from "./TreningTopics";

function CommunitySection() {
  const { data: posts, isLoading } = useHomePosts();

  return (
    <HomeCommunitySectionLayout>
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — Featured + small cards */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {posts && <HomeCommunitySectionBigCard {...posts[0]} />}
          {isLoading && <HomeCommunitySectionBigCardSkeleton />}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">
          {/* Trending Topics */}
          <PostTrendingTopicsSection limit={3} />

          {/* Sponsored / Ad */}
          <HomeCommunitySectionAdd />
        </div>
      </div>
      {posts && (
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {posts.slice(1).map((p: Post) => (
            <HomeCommunitySectionSmallCard key={p.id} {...p} />
          ))}
        </div>
      )}
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <HomeCommunitySectionSmallCardSkeleton key={index} />
          ))}
      </div>
      {/* Bottom CTA */}
      <HomeCommunitySectionMoreButton />
    </HomeCommunitySectionLayout>
  );
}

export default CommunitySection;
