import { ArrowUpRight } from "lucide-react";

function HomeFeaturedPostsAdvertisement() {
  return (
    <div className="rounded-2xl py-5 px-3 text-white shadow-md relative overflow-hidden bg-linear-to-br advertisement1 w-full  h-fit">
      <span className="text-[10px] font-semibold uppercase text-white  mb-4 block ">
        مدفوع
      </span>
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"
        alt="Sponsored"
        className="max-w-full w-full h-fit sm:h-40 object-cover"
      />
      <h4 className="font-bold text-lg leading-tight mb-1">عدة سفر</h4>
      <p className="text-sm opacity-80 mb-4">
        حقائب ظهر وإكسسوارات فاخرة بخصم يصل إلى 60%!
      </p>
      <button className="w-full bg-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:cursor-pointer transition-opacity">
        <span className="bg-white bg-linear-to-r  to-[#F97316] from-[#FBBF24] bg-clip-text text-transparent flex items-center gap-2 ">
          اكتشف العروض <ArrowUpRight size={16} className=" text-[#FBBF24]" />
        </span>
      </button>
    </div>
  );
}

export default HomeFeaturedPostsAdvertisement;
