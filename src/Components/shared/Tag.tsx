import { useNavigate } from "react-router-dom";
import { localizedPath } from "../../i18n/paths";
import { useLocale } from "../../i18n/useLocale";

export function Tag({ label,dir="community" }: {label:string,dir?:string}) {
  const { lang } = useLocale();
  const navigate = useNavigate();
  return (
    <div 
    onClick={()=>navigate(localizedPath(lang, `${dir}?search=` + label.slice(1)) )}
    className="  rounded-full  flex items-center justify-center hover:opacity-90 opacity-80 ">
        <button className="flex items-center gap-3 text-sm font-bold px-2 py-0.5 bg-gray-100 rounded-full  bg-linear-to-r from-primary/2 to-secondary/2 hover:cursor-pointer ">
          <span className="  bg-white main-gradient bg-clip-text text-xs text-transparent ">
            {label}
          </span>
        </button>
      </div>
  );
}

export function Badge( props: any ) {
  return (
    <span
      style={{ backgroundColor: props.color  }}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full   text-white h-fit`}
    >
      {props.tier}
    </span>
  );
}