export function Tag({ label }: any) {
  return (
    <div className="  rounded-full hover:cursor-pointer flex items-center justify-center opacity-80 hover:opacity-90 transition-opacity duration-300">
        <button className="flex items-center gap-3 text-sm font-bold px-2 py-0.5 bg-gray-100 rounded-full  hover:shadow-md   bg-linear-to-r from-primary/2 to-secondary/2 hover:cursor-pointer ">
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
      className={`text-xs font-bold px-3 py-1 rounded-full   text-white`}
    >
      {props.tier}
    </span>
  );
}