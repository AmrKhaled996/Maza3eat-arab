import Skeleton from "../../shared/Skeleton";

function HomeCommunitySectionSmallCardSkeleton() {
    return ( <div className="flex flex-col gap-2">
        <Skeleton className="w-full sm:h-44 h-64" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-5/6" />
    </div> 
    );
}

export default HomeCommunitySectionSmallCardSkeleton;