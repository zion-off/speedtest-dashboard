"use client";

import React, {
    useEffect,
    useState,
    useRef,
    useMemo,
    useCallback,
  } from "react";
import { SpeedPoint } from "@/data/speed";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { MemoizedMarker } from "./MemoizedMarker";

type Props = { points: SpeedPoint[] };

export function Markers({ points }: Props) {
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
