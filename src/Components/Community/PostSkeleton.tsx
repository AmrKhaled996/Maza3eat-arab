import Skeleton from "../shared/Skeleton";

function PostSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-8 md:min-h-80 md:max-h-80 rounded-xl w-full ">
      {/* Image */}
      <div className="sm:w-52 md:w-80 h-full shrink-0">
      <Skeleton className="w-full h-70 rounded-lg shrink-0" />

      </div>
      
      {/* Text */}
      <div className="flex-1 space-y-2 pt-6 ">
        <Skeleton className="h-8 w-full mb-8" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-5/6" />
      </div>

    </div>
  );
}

export default PostSkeleton;
