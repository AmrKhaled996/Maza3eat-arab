import { useQuery } from "@tanstack/react-query";
import { getHomeFeaturedPosts } from "../../Apis/HomeApi/HomeMainContant";

function useHomeFeatured() {
    return  useQuery({
        queryKey: ["home-featured"],
        queryFn: getHomeFeaturedPosts 
    })
}

export default useHomeFeatured;


