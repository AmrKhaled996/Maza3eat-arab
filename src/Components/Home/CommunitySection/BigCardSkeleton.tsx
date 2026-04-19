import Skeleton from "../../shared/Skeleton";

function HomeCommunitySectionBigCardSkeleton() {
    return ( <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-64 sm:h-72" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-5/6" />
    </div> 
    );
}

export default HomeCommunitySectionBigCardSkeleton;