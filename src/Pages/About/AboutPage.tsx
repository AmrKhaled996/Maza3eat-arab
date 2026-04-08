import { useTranslation } from "react-i18next";
import { Title } from "react-head";
import AboutHeroSection from "../../Components/About/HeroSection";
import DestinationsGrid from "../../Components/About/DestinationsGrid";
import StoryMissionVision from "../../Components/About/StoryMissionVision";
import FAQSection from "../../Components/About/FAQSection";
import ContactForm from "../../Components/About/ContactForm";
import Footer from "../../Components/shared/Footer";

export default function AboutPage() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-background">
      <Title>{t("about.meta")}</Title>
      <AboutHeroSection />
      <DestinationsGrid />
      <StoryMissionVision />
      <FAQSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
