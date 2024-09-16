"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import speeds from "@/data/speed";

export default function Dashboard() {
  const position = { lat: 43.64, lng: -79.41 };
  const [open, setOpen] = useState(false);
  const markerRef = useRef(null);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
      <div className="w-full h-full">
        <Map
          defaultZoom={9}
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
        >
          <Markers points={speeds} />
        </Map>
      </div>
    </APIProvider>
  );
}

type Point = google.maps.LatLngLiteral & {
  key: string;
  isp: string;
  advertised: number;
  download: number;
  upload: number;
};
type Props = { points: Point[] };

function Markers({ points }: Props) {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [openInfoWindowKey, setOpenInfoWindowKey] = useState<string | null>(null);

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

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;
    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  }, [markers]);

  const ratioToColor = useCallback((advertised: number, download: number) => {
    const interpolateColors = (color1: number[], color2: number[], ratio: number): number[] => {
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
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
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
  point: Point;
  setMarkerRef: (marker: Marker | null, key: string) => void;
  openInfoWindowKey: string | null;
  setOpenInfoWindowKey: (key: string | null) => void;
  ratioToColor: (advertised: number, download: number) => string;
  marker: Marker | undefined;
};

const MemoizedMarker = React.memo(({ point, setMarkerRef, openInfoWindowKey, setOpenInfoWindowKey, ratioToColor, marker }: MemoizedMarkerProps) => (
  <AdvancedMarker
    position={point}
    ref={(marker) => setMarkerRef(marker, point.key)}
    onClick={() => setOpenInfoWindowKey(point.key)}
  >
    <span
      className="inline-block w-2 h-2 rounded-full"
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
        <div className="p-4">
          <span>{point.isp}</span>
        </div>
      </InfoWindow>
    )}
  </AdvancedMarker>
));