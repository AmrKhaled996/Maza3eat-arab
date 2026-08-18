import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Advertisement } from "../../../Types/Advertisement";

function HomeCommunityPostsAdvertisement({ad}:{ad?:Advertisement}) {
  const { t } = useTranslation("common");
  return (
    <div className="rounded-2xl py-5 px-8 text-white shadow-md relative overflow-hidden bg-linear-to-br secondary-gradient w-full  max-w-100 h-fit">
      <span className="text-[10px] font-semibold uppercase text-white  mb-4 block ">
        {t("home.sponsored")}
      </span>
      <img
        src={ad?.image?.url||"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"}
        alt={ad?.image?.name||"Sponsored"}
        className="max-w-full w-full h-fit sm:h-40 object-cover"
      />
      <h4 className="font-bold text-lg leading-tight my-2">
        {ad?.title||t("home.adTravelGear")}
      </h4>
      <p className="text-sm opacity-80 mb-4 line-clamp-2">
        {ad?.text||t("home.adTravelGearDesc")}
      </p>
      <button 
       onClick={()=>{window.open(`${ad?.link}`, `_blank`)}}
      className="w-full bg-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:cursor-pointer transition-opacity">
        <span className="bg-white secondary-gradient bg-clip-text text-transparent flex items-center gap-2 ">
          {ad?.buttonText}
          <ArrowUpRight size={16} className=" text-accent" />
        </span>
      </button>
    </div>
  );
}

export default HomeCommunityPostsAdvertisement;
