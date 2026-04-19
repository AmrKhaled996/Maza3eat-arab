import Skeleton from "../shared/Skeleton";

function QuestionCardSkeleton() {
    return ( <div className="flex flex-col gap-2 border border-gray-200 rounded-2xl p-4">
        <Skeleton className="w-full h-64 sm:h-72" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-5/6" />

    </div> );
}

export default QuestionCardSkeleton;