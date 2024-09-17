import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export type SpeedPoint = {
  key: string;
  isp: string;
  advertised: number;
  download: number;
  upload: number;
  lat: number;
  lng: number;
};

export async function getSpeedPoints(): Promise<SpeedPoint[]> {
  const speedPointsCollection = collection(db, "speedPoints");
  const speedPointsSnapshot = await getDocs(speedPointsCollection);
  
  const formattedPoints: SpeedPoint[] = speedPointsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      key: doc.id,
      isp: data.isp,
      advertised: data.advertised,
      download: data.download,
      upload: data.upload,
      lat: data.lat,
      lng: data.lng,
    };
  });

  return formattedPoints;
}