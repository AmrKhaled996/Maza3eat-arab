import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../Apis/ProfileApi/profile-api";

export default function useGetProfile( userId: string){
    return useQuery({
        queryKey: ['profile'],
        queryFn:()=> getUserProfile({userId: userId}),
    })
}