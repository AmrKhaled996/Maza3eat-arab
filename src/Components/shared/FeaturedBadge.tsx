import { Star } from "lucide-react";

function FeaturedBadge() {
    return (
      <div className="absolute top-2 left-2  opacity-80  z-20">
        <button className="flex items-center gap-3 text-sm font-bold  rounded-full bg-black/30  ">
          <span className=" text-white font-bold px-8 pb-1 text-center align-middle flex items-end justify-center gap-2 ">
            <Star fill='white' size={14}/>مميز 
          </span>
        </button>
      </div>  );
}

export default FeaturedBadge;