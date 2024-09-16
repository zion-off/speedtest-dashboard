type RawSpeedPoint = [string, number, number, number, number, number];

type SpeedPoint = {
  key: string;
  isp: string;
  advertised: number;
  download: number;
  upload: number;
  lat: number;
  lng: number;
};

const points: RawSpeedPoint[] = [
  // dummy data: [ISP name, advertised download speed, download speed, upload speed, lat, lng]
  ["Bell", 100, 120, 90, 43.64, -79.41],
  ["Rogers", 100, 100, 80, 43.64, -79.42],
  ["Telus", 100, 70, 70, 43.64, -79.43],
  ["Fido", 100, 60, 60, 43.64, -79.44],
  ["Freedom", 100, 50, 50, 43.64, -79.45],
  ["Koodo", 100, 40, 40, 43.64, -79.46],
  ["Virgin", 100, 30, 30, 43.64, -79.47],
  ["Public Mobile", 100, 20, 20, 43.64, -79.48],
  ["Chatr", 100, 10, 10, 43.64, -79.49],
  ["Shaw", 100, 5, 5, 43.64, -79.5],
];

const formattedPoints: SpeedPoint[] = points.map(
  ([isp, advertised, download, upload, lat, lng]) => ({
    key: JSON.stringify({
      timestamp: Date.now(),
      isp: isp,
      lat: lat,
      lng: lng,
    }),
    isp,
    advertised,
    download,
    upload,
    lat,
    lng,
  })
);

export default formattedPoints;
