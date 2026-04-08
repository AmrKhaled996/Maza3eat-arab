import { useQuery } from "@tanstack/react-query";
import { getHomePopularQuestions } from "../../Apis/HomeApi/HomeSecondaryContant";

function useHomePopularQuestions() {
    return  useQuery({
        queryKey: ["home-popular-questions"],
        queryFn: getHomePopularQuestions 
    })
}

export default useHomePopularQuestions;


