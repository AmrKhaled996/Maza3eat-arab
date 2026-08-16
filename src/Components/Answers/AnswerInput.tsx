import { useState } from "react";
import { createAnswers } from "../../Apis/AnswersApi/Answers";
import {  useParams } from "react-router-dom";
import { useAuth } from "../../Context/Auth";
import { LoaderIcon } from "lucide-react";
import type { Answer } from "../../Types/Answer";
import { useTranslation } from "react-i18next";
import Avatar from "../shared/Avatar";

function AnswerInput({onAddAnswer}:{onAddAnswer:(answer:Answer)=>void}) {
  const { t } = useTranslation();
  const [answerValue, setAnswerValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { id: questionIdparam } = useParams<{ id: string }>();
  const { user } = useAuth();
 

  const handleAnswer = async () => {
    const content = answerValue.trim();

    if (!content) return;

    if (!questionIdparam) {
      console.error("no question id");
      return;
    }

    if (content.length > 1000) {
      console.error("Answer is too long");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createAnswers(content, questionIdparam);
      console.log("the response", response);
      onAddAnswer(response?.data?.data);
      setAnswerValue("");
    } catch (error) {
      console.error(error);
      console.error("Failed to create answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center max-w-xl justify-center mx-auto gap-3 mb-8 bg-white rounded-2xl p-3 w-full ">
      <Avatar
        src={user?.avatar}
        name={user?.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white outline-3 shadow shrink-0"
        style={{ outlineColor: user?.tier?.badgeColor }}
      />
      <input
        value={answerValue}
        onChange={(e) => {
          setAnswerValue(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleAnswer()}
        placeholder={t("answers.placeholder")}
        className="w-full max-w-xl rounded-full border-2 border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={() => handleAnswer()}
        className={`text-white text-sm font-bold px-5 py-2 rounded-full shrink-0 hover:opacity-90 transition-opacity shadow hover:cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{ background: "linear-gradient(135deg, #2563eb, #9333ea)" }}
      >
        {isSubmitting ? (
          <>
            <LoaderIcon className="animate-spin" />
          </>
        ) : (
          t("answers.publish")
        )}
      </button>
    </div>
  );
}

export default AnswerInput;
