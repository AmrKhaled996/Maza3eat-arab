import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import HeroSectionLayout from "../../Components/Home/HeroSection/Layout";
import QAForum from "../../Components/Home/Q&ASection/Q&A";
import CommunitySection from "../../Components/Home/CommunitySection/Community";
import FeaturedPosts from "../../Components/Home/FeaturedPostSection/Featuerd";
import Footer from "../../Components/shared/Footer";
import { Title } from "react-head";
import InfiniteSlider from "../../Components/Home/Saperators/Saperator1";
import useHomeAds from "../../Hooks/HomeHooks/useHomeAdvertisement";
import type { Advertisement } from "../../Types/Advertisement";

const DiscoverGallery = lazy(() => import("../../Components/Home/Gallery/DiscoverGallery"));

export default function HomePage() {
  const { t } = useTranslation("common");

  const { data: HomeAdsData } = useHomeAds() as { data?: Advertisement[] };

  const topAdvertisement = HomeAdsData?.find((i) => i.position === "top");
  const middleAdvertisement = HomeAdsData?.find((i) => i.position === "middle");
  const bottomAdvertisement = HomeAdsData?.find((i) => i.position === "bottom");

  return (
    <>
      <Title>{t("meta.homeTitle")}</Title>
      <HeroSectionLayout />
      <FeaturedPosts ad={topAdvertisement} />
      <InfiniteSlider />
      <CommunitySection ad={middleAdvertisement} />
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">Loading gallery...</div>}>
        <DiscoverGallery />
      </Suspense>
      <QAForum ad={bottomAdvertisement} />
      <Footer />
    </>
  );
}
