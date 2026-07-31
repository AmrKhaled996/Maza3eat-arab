import { ArrowUpRight } from "lucide-react";
import type { Advertisement } from "../../Types/Advertisement";
import { useTranslation } from "react-i18next";


function HomeCommunitySectionAdd({ className ,ad }: { className?: string ,ad?:Advertisement }) {
    const { t } = useTranslation("common");
    console.log("the ad", ad)
  return (
    <div className={`rounded-2xl h-fit mb-5 py-5 px-5 text-white shadow-md relative overflow-hidden bg-linear-to-br secondary-gradient  ${className}`}>
      <span className="text-[10px] font-semibold uppercase text-white  mb-4 block ">
        {t("home.sponsored")}
      </span>
      <img
        src={ad?.image?.url||"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"}
        alt={ad?.image?.name||"Sponsored"}
        className="max-w-full w-full h-fit sm:h-40 object-cover aspect-video"
      />
      <h4 className="font-bold text-lg leading-tight my-2 line-clamp-2">
        {ad?.title||t("home.adTravelGear")}
      </h4>
      <p className="text-sm opacity-80 mb-4 line-clamp-4">
        {ad?.text||t("home.adTravelGearDesc")}
      </p>
      <button
      disabled={!ad?.link}
      onClick={()=>{ if (ad?.link) window.open(ad.link, "_blank", "noopener,noreferrer"); }}
      className="w-full bg-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="bg-white secondary-gradient bg-clip-text text-transparent flex items-center gap-2 ">
          <ArrowUpRight size={16} className=" text-accent" /> {ad?.buttonText||t("home.adCta")}
        </span>
      </button>
    </div>
  );
}

export default HomeCommunitySectionAdd;
