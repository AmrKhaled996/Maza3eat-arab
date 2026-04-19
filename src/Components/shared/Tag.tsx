export function Tag({ label }: any) {
  return (
    <div className="  rounded-full  flex items-center justify-center opacity-80 y ">
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
      className={`text-xs font-bold px-3 py-2 rounded-full   text-white h-fit`}
    >
      {props.tier}
    </span>
  );
}