import { useQuery } from "@tanstack/react-query";
import { getHomeTopTrending } from "../../Apis/HomeApi/HomeSecondaryContant";


function useHomeTrendingPosts(limit: number = 3) {
    return  useQuery({
        queryKey: ["home-trending-posts"],
        queryFn: () => getHomeTopTrending(limit)
    })
}

export default useHomeTrendingPosts;
