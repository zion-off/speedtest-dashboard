"use client";

import { useState } from "react";
import MapBox from "@/components/ui/map";
import SearchBar from "@/components/ui/search";
import { TestForm } from "@/components/ui/test";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[90vw] md:w-[75vw] flex flex-col gap-4 h-full">
      <div className="w-full flex flex-row gap-2">
        <SearchBar />
        <TestForm open={open} setOpen={setOpen} />
      </div>
      <div className="rounded-2xl overflow-clip w-full h-full">
        <MapBox refresh={open} />
      </div>
    </div>
  );
};

export default Dashboard;
