import { useQuery } from "@tanstack/react-query";
import { getHomeAdvertisement } from "../../Apis/AdvertisementApi/HomeAdvertisement";

function useHomeAds() {
    return  useQuery({
        queryKey: ["home-Ads"],
        queryFn: getHomeAdvertisement 
    })
}

export default useHomeAds;
