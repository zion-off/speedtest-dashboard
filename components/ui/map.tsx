"use client";

import React, { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { subscribeToSpeedPoints, SpeedPoint } from "@/data/speed";
import { Markers } from "./Markers";

export default function MapBox({
  refresh,
  selectedISPs,
  speeds,
  setSpeeds,
}: {
  refresh: boolean;
  selectedISPs: string[];
  speeds: SpeedPoint[];
  setSpeeds: (speeds: SpeedPoint[]) => void;
}): React.ReactElement {
  // Dhaka coordinates for centering the map
  const position = { lat: 23.8041, lng: 90.4152 };

  const [filteredSpeeds, setFilteredSpeeds] = useState<SpeedPoint[]>([]);

  useEffect(() => {
    if (refresh) return;
    const unsubscribe = subscribeToSpeedPoints(setSpeeds);
    return () => unsubscribe(); // Clean up listener on unmount
  }, [refresh]);

  // Filter speed points by selected ISPs
  useEffect(() => {
    if (selectedISPs.length === 0) {
      setFilteredSpeeds(speeds); // Show all speeds if no ISP is selected
    } else {
      const filtered = speeds.filter((point) =>
        selectedISPs.includes(point.isp)
      );
      setFilteredSpeeds(filtered);
    }
  }, [speeds, selectedISPs]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <div className="w-full h-full">
        <Map
          defaultZoom={11}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
        >
          <Markers points={filteredSpeeds} />
        </Map>
      </div>
    </APIProvider>
  );
}
