"use client";

import React from "react";
import { IoGlobe } from "react-icons/io5";
import MagicButton from "../ui/MagicButton";
import {
  GlowingStarsBackgroundCard,
} from "../ui/glowing-stars";

const Grid = () => {
  const scrollToBottom = () => {
    const element = document.getElementById("dashboard");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  return (
    <div className="w-full md:h-2/3 flex md:flex-row flex-col items-center justify-center gap-5 md:gap-10">
      <GlowingStarsBackgroundCard className="w-4/5 md:w-2/5 md:h-full rounded-3xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 flex flex-col justify-end overflow-clip px-5 pt-5">
        <h3 className="font-bold text-white">
          Report your own network speed and contribute to the community
        </h3>
        <MagicButton
          title="Add your speed to the map"
          icon={<IoGlobe />}
          position="left"
          handleClick={scrollToBottom}
          otherClasses="bg-zinc-900 text-left"
        />
      </GlowingStarsBackgroundCard>

      <div className="flex flex-col w-4/5 md:w-2/5 gap-5 md:gap-10 h-full">
        <div className="flex flex-col w-full h-1/2  rounded-3xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 align-middle justify-center px-5 gap-3 hover:scale-95 duration-200 ease-in-out py-5">
          <h3 className="mb-4 font-bold text-white">
            Colors indicate how well the measured speed matches the advertised
            speed
          </h3>
          <div className="flex items-center gap-4">
            <span className="w-4 h-4 rounded-full bg-green-400">&nbsp;</span>
            <p className="text-gray-50 text-xs">
              Matches or exceeds advertised speed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-4 h-4 rounded-full bg-yellow-400">&nbsp;</span>
            <p className="text-gray-50 text-xs">
              Lower than advertised speed, but fair
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-4 h-4 rounded-full bg-red-400">&nbsp;</span>
            <p className="text-gray-50 text-xs">
              Poor compared to advertised speed
            </p>
          </div>
        </div>
        <div className="w-full h-1/2 rounded-3xl bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 overflow-clip flex flex-row items-center relative pl-5 hover:scale-95 duration-200 ease-in-out">
          <h3 className="w-2/3 font-bold text-white">
            Find the ISP that delivers the best speed in your area
          </h3>

          <div className="relative -right-4">
            <List />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;

function List() {
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
