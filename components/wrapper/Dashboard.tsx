"use client";

import React, { useState, useCallback } from "react";
import MapBox from "@/components/ui/map";
import SearchBar from "@/components/ui/search";
import { TestForm } from "@/components/ui/test";

const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedISPs, setSelectedISPs] = useState<string[]>([]);

  // using useCallback to prevent unnecessary re-renders
  const handleSetOpen = useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const handleSetSelectedISPs = useCallback((value: string[]) => {
    setSelectedISPs(value);
    console.log(value);
  }, []);

  return (
    <div className="w-[90vw] md:w-[75vw] flex flex-col gap-4 h-full">
      <div className="w-full flex flex-row gap-2">
        <SearchBar onSelectionChange={handleSetSelectedISPs} />
        <TestForm open={open} setOpen={handleSetOpen} />
      </div>
      <div className="rounded-2xl overflow-clip w-full h-full">
        <MapBox refresh={open} selectedISPs={selectedISPs} />
      </div>
    </div>
  );
};

export default Dashboard;
