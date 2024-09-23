import React from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import type { Marker } from "@googlemaps/markerclusterer";
import { SpeedPoint } from "@/data/speed";

type MemoizedMarkerProps = {
  point: SpeedPoint;
  setMarkerRef: (marker: Marker | null, key: string) => void;
  openInfoWindowKey: string | null;
  setOpenInfoWindowKey: (key: string | null) => void;
  ratioToColor: (advertised: number, download: number) => string;
  marker: Marker | undefined;
};

export const MemoizedMarker = React.memo(
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
          <div className="p-4 text-slate-200 md:max-w-72">
            <h3 className="font-bold text-lg">{point.isp}</h3>
            <p>
              <span className="font-semibold">Advertised speed:</span>{" "}
              {point.advertised} Mbps
            </p>
            <p>
              <span className="font-semibold">Measured download speed:</span>{" "}
              {point.download} Mbps
            </p>
            <p>
              <span className="font-semibold">Measured upload speed:</span>{" "}
              {point.upload} Mbps
            </p>
            <p>
              <span className="font-semibold">Speed accuracy:</span>{" "}
              {Math.floor((point.download / point.advertised) * 100)}%
            </p>
            {point.note && (
              <p>
                <span className="font-semibold">Additional feedback:</span>{" "}
                {point.note}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
);
