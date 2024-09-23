// Decorative list for third card in the bento grid
export default function ISPNameStrip() {
    const leftLists = ["Link3", "Amber IT", "Carnival"];
    const rightLists = ["Dot", "InfoLink", "Matchnet"];
    return (
      <div className="flex gap-1 lg:gap-5 w-fit opacity-55">
        <div className="flex flex-col gap-3 md:gap-3 ">
          {leftLists.map((item, i) => (
            <span
              key={i}
              className="lg:px-3 py-2 px-3 text-xs  opacity-50 
                      lg:opacity-100 rounded-lg text-center bg-zinc-800 text-white"
            >
              {item}
            </span>
          ))}
          <span className="lg:px-3 py-4 px-3  rounded-lg text-center bg-zinc-900"></span>
        </div>
        <div className="flex flex-col gap-3 md:gap-3 ">
          <span className=" lg:px-3 py-4 px-3  rounded-lg text-center bg-zinc-900"></span>
          {rightLists.map((item, i) => (
            <span
              key={i}
              className="lg:px-3 py-2 px-3 text-xs  opacity-50 
                      lg:opacity-100 rounded-lg text-center bg-zinc-800 text-white"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }
  