import { useQuery } from "@tanstack/react-query";
import { getHomePopularQuestions } from "../../Apis/HomeApi/HomeSecondaryContant";

function useHomePopularQuestions(limit: number) {
    return  useQuery({
        queryKey: ["home-popular-questions"],
        queryFn: () => getHomePopularQuestions(limit)
    })
}

export default useHomePopularQuestions;


