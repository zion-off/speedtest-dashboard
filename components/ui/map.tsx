"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { getSpeedPoints, SpeedPoint } from "@/data/speed";

export default function MapBox({
  refresh,
  selectedISPs,
}: {
  refresh: boolean;
  selectedISPs: string[];
}): React.ReactElement {
  // Dhaka coordinates for centering the map
  const position = { lat: 23.8041, lng: 90.4152 };
  const [speeds, setSpeeds] = useState<SpeedPoint[]>([]);
  const [filteredSpeeds, setFilteredSpeeds] = useState<SpeedPoint[]>([]);

  // Fetch speed points from the database on mount
  useEffect(() => {
    if (refresh) return;
    getSpeedPoints().then((speeds) => setSpeeds(speeds));
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

type Props = { points: SpeedPoint[] };

function Markers({ points }: Props) {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [openInfoWindowKey, setOpenInfoWindowKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = useCallback(
    (marker: Marker | null, key: string) => {
      // Only update the state if the marker is different from what we already have
      setMarkers((prev) => {
        if (marker && prev[key] !== marker) {
          return { ...prev, [key]: marker };
        } else if (!marker && prev[key]) {
          const newMarkers = { ...prev };
          delete newMarkers[key];
          return newMarkers;
        }
        return prev; // No state update needed if marker already exists or no change
      });
    },
    [setMarkers] // Ensure the function is not recreated unnecessarily
  );
  

  const ratioToColor = useCallback((advertised: number, download: number) => {
    const interpolateColors = (
      color1: number[],
      color2: number[],
      ratio: number
    ): number[] => {
      const r = Math.round(color1[0] + (color2[0] - color1[0]) * ratio);
      const g = Math.round(color1[1] + (color2[1] - color1[1]) * ratio);
      const b = Math.round(color1[2] + (color2[2] - color1[2]) * ratio);
      return [r, g, b];
    };

    const red = [255, 0, 0];
    const yellow = [255, 255, 0];
    const green = [0, 255, 0];
    const ratio = download / advertised;
    const color = ratio >= 1 ? green : interpolateColors(red, yellow, ratio);
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`;
  }, []);

  const memoizedPoints = useMemo(() => points, [points]);

  return (
    <>
      {memoizedPoints.map((point) => (
        <MemoizedMarker
          key={point.key}
          point={point}
          setMarkerRef={setMarkerRef}
          openInfoWindowKey={openInfoWindowKey}
          setOpenInfoWindowKey={setOpenInfoWindowKey}
          ratioToColor={ratioToColor}
          marker={markers[point.key]}
        />
      ))}
    </>
  );
}

type MemoizedMarkerProps = {
  point: SpeedPoint;
  setMarkerRef: (marker: Marker | null, key: string) => void;
  openInfoWindowKey: string | null;
  setOpenInfoWindowKey: (key: string | null) => void;
  ratioToColor: (advertised: number, download: number) => string;
  marker: Marker | undefined;
};

const MemoizedMarker = React.memo(
  ({
    point,
    setMarkerRef,
    openInfoWindowKey,
    setOpenInfoWindowKey,
    ratioToColor,
    marker,
  }: MemoizedMarkerProps): React.ReactElement => (
    <AdvancedMarker
      position={{ lat: point.lat, lng: point.lng }}
      ref={(marker) => setMarkerRef(marker, point.key)}
      onClick={() => setOpenInfoWindowKey(point.key)}
    >
      <span
        className="inline-block w-7 h-7 rounded-full backdrop-filter backdrop-blur-sm bg-opacity-10 "
        style={{
          backgroundColor: ratioToColor(point.advertised, point.download),
        }}
      ></span>
      {openInfoWindowKey === point.key && marker && (
        <InfoWindow
          anchor={marker}
          onClose={() => setOpenInfoWindowKey(null)}
          onCloseClick={() => setOpenInfoWindowKey(null)}
        >
          <div className="p-4 text-slate-200">
            <h3 className="font-bold text-lg">{point.isp}</h3>
            <p>Advertised speed: {point.advertised} Mbps</p>
            <p>Measured download speed: {point.download} Mbps</p>
            <p>Measured upload speed: {point.upload} Mbps</p>
            <p>Speed accuracy: {(point.download / point.advertised) * 100}%</p>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
);
