import { useQuery } from "@tanstack/react-query";
import { getContentAdvertisement } from "../../Apis/AdvertisementApi/ContentAdvertisementApi";

function useContentAds() {
    return  useQuery({
        queryKey: ["content-Ads"],
        queryFn: getContentAdvertisement 
    })
}

export default useContentAds;
