import { ArrowUpRight } from "lucide-react";


function HomeCommunitySectionAdd() {
  return (
    <div className="rounded-2xl p-5 text-white shadow-md relative overflow-hidden bg-linear-to-br secondary-gradient ">
      <span className="text-[10px] font-semibold uppercase text-white  mb-4 block ">
        مدفوع
      </span>
      <h4 className="font-bold text-lg leading-tight mb-1">عدة سفر</h4>
      <p className="text-sm opacity-80 mb-4">
        حقائب ظهر وإكسسوارات فاخرة بخصم يصل إلى 60%!
      </p>
      <button className="w-full bg-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:cursor-pointer transition-opacity">
        <span className="bg-white secondary-gradient bg-clip-text text-transparent flex items-center gap-2 ">
          اكتشف العروض <ArrowUpRight size={16} className=" text-accent" />
        </span>
      </button>
    </div>
  );
}

export default HomeCommunitySectionAdd;
