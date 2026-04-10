import { Title } from "react-head";
import NavigationBar from "../shared/NavigationBar";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";


function MainPageLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Title>{t("CommunityMainPage.meta")}</Title>
        <NavigationBar page="community" />
        {children}
      </div>
    </div>
  );
}

export default MainPageLayout;
