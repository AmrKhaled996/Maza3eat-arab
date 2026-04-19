import useHomeFeatured from "../../../Hooks/HomeHooks/useHomeFeatured";
import type { Post } from "../../../Types/Post";
import HomeFeaturedPostsAdvertisement from "./Advertisement";
import HomeFeatuerdPostsCard from "./Cards";
import FeaturedCardSkeleton from "./CardSkeleton";
import HomeFeaturedPostsLayout from "./Layout";
import HomeFeaturedPostsSectionMoreButton from "./MoreButton";

function FeaturedPosts() {
  const { data: posts, isLoading } = useHomeFeatured();
  // console.log("featuerd: ", posts);
  return (
    <HomeFeaturedPostsLayout>
      {/* Main grid */}

      <div className=" grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {posts?.map((p: Post) => (
          <HomeFeatuerdPostsCard key={p.id} {...p} />
        ))}
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <FeaturedCardSkeleton key={index} />
          ))}
        <HomeFeaturedPostsAdvertisement />
      </div>

      {/* Bottom CTA */}
      <HomeFeaturedPostsSectionMoreButton />
    </HomeFeaturedPostsLayout>
  );
}

export default FeaturedPosts;
