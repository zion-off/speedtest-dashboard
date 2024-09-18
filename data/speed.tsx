import { collection, onSnapshot } from "firebase/firestore";
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

export function subscribeToSpeedPoints(
  callback: (speedPoints: SpeedPoint[]) => void
): () => void {
  const speedPointsCollection = collection(db, "speedPoints");
  
  const unsubscribe = onSnapshot(speedPointsCollection, (snapshot) => {
    const formattedPoints: SpeedPoint[] = snapshot.docs.map((doc) => {
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
    callback(formattedPoints); 
  });

  return unsubscribe; 
}
