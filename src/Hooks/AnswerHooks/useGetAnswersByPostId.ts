import { useInfiniteQuery } from "@tanstack/react-query";
import { getAnswersByQuestionId, getAnswersByQuestionIdWithCursor } from "../../Apis/AnswersApi/Answers";




function useGetAnswersByQuestionId( questionId: string ,cursor:string ="" , excludeAnswerId?: string) {
    return  useInfiniteQuery({
        queryKey: ["get-question-answer", questionId],
        queryFn: ({ pageParam = cursor }) =>{
  
      if(pageParam){
        return getAnswersByQuestionIdWithCursor(questionId, pageParam, excludeAnswerId);
      }
      return  getAnswersByQuestionId(questionId, excludeAnswerId)},
    initialPageParam: cursor,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!questionId,
  });

}

export default useGetAnswersByQuestionId;
