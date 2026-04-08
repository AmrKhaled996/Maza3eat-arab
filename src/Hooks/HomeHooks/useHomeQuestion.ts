import { useQuery } from "@tanstack/react-query";
import { getHomeQuestions } from "../../Apis/HomeApi/HomeMainContant";

function useHomeQuestions() {
    return  useQuery({
        queryKey: ["home-questions"],
        queryFn: getHomeQuestions 
    })
}

export default useHomeQuestions;


