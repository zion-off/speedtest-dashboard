"use client";

import React, { useState, useCallback } from "react";
import MapBox from "@/components/ui/map";
import SearchBar from "@/components/ui/search";
import { TestForm } from "@/components/ui/testForm";
import { SpeedPoint } from "@/data/speed";

const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedISPs, setSelectedISPs] = useState<string[]>([]);
  const [speeds, setSpeeds] = useState<SpeedPoint[]>([]);

  // using useCallback to prevent unnecessary re-renders
  const handleSetOpen = useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const handleSetSelectedISPs = useCallback((value: string[]) => {
    setSelectedISPs(value);
  }, []);

  const handleSetSpeeds = useCallback((value: SpeedPoint[]) => {
    setSpeeds(value);
  }, []);

  return (
    <div className="w-[90vw] md:w-[75vw] flex flex-col gap-4 h-full">
      <div className="w-full flex flex-row gap-2">
        <SearchBar onSelectionChange={handleSetSelectedISPs} speeds={speeds}/>
        <TestForm open={open} setOpen={handleSetOpen} />
      </div>
      <div className="rounded-2xl overflow-clip w-full h-full">
        <MapBox
          refresh={open}
          selectedISPs={selectedISPs}
          speeds={speeds}
          setSpeeds={handleSetSpeeds}
        />
      </div>
    </div>
  );
};

export default Dashboard;
