import { useQuery } from "@tanstack/react-query";
import { getHomePosts } from "../../Apis/HomeApi/HomeMainContant";

function useHomePosts() {
    return  useQuery({
        queryKey: ["home-posts"],
        queryFn: getHomePosts 
    })
}

export default useHomePosts;


