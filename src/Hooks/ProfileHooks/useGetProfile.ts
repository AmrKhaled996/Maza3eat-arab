import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../Apis/ProfileApi/profile-api";

export default function useGetProfile(){
    return useQuery({
        queryKey: ['profile'],
        queryFn: getUserProfile,
    })
}