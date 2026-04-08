import { ArrowRight } from "lucide-react";

function HomeQandAPostsSectionMoreButton() {
    return (  <div className="flex justify-center mt-10">

        <button className="flex items-center gap-3 text-sm font-bold px-8 py-3.5 rounded-full  hover:shadow-lg transition-all group main-gradient text-white hover:cursor-pointer ">
          <span className="group-hover:translate-x-1 transition-transform   flex items-end justify-center gap-3 ">
             <ArrowRight size={16} className="text-white"/>انضم للمناقشة
          </span>
        </button>
    </div>
     );
}

export default HomeQandAPostsSectionMoreButton;