import { useQuery } from "@tanstack/react-query";
import { getHomeTopTrending } from "../../Apis/HomeApi/HomeSecondaryContant";


function useHomeTrendingPosts() {
    return  useQuery({
        queryKey: ["home-trending-posts"],
        queryFn: getHomeTopTrending 
    })
}

export default useHomeTrendingPosts;
