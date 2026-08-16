import { Title } from "react-head";
import NavigationBar from "../../Components/shared/NavigationBar";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";

export default function PendingQuestionPage() {
    const {t} =useTranslation("common");
    const {lang} = useLocale();
    const navigate = useNavigate();
    const {user}=useAuth();
  return (
    <div className="min-h-screen pb-16 ">
        <NavigationBar page="q&a" solidNav />
        <Title>{t("pendingQuestion.meta")}</Title>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28  ">

          <div className="text-center bg-white shadow-lg rounded-3xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("pendingQuestion.title")}
            </h1>
            <p className="text-gray-600">
              {t("pendingQuestion.subtitle")} 
            </p>
            <button 
            onClick={()=>navigate(localizedPath(lang, "profile/" + user?.id))}
            className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              {t("pendingQuestion.cta")}
            </button>
          </div>
        </div>
      </div>
  )
}