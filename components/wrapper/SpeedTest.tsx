"use client";

import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  use,
} from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ServerLocation {
  country: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
}

interface SpeedTestProps {
  setDownload: Dispatch<SetStateAction<number>>;
  setUpload: Dispatch<SetStateAction<number>>;
  setServer: Dispatch<SetStateAction<ServerLocation | null>>;
  setUserISP: Dispatch<SetStateAction<string>>;
}

const SpeedTest: React.FC<SpeedTestProps> = ({
  setDownload,
  setUpload,
  setServer,
  setUserISP,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ downloadSpeed: 0, uploadSpeed: 0 });
  const [serverLocation, setServerLocation] = useState<ServerLocation | null>(
    null
  );
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // State variable for progress

  const fetchUserISP = async () => {
    try {
      const response = await fetch(
        `https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IP_INFO_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch ISP info.");
      }
      const data = await response.json();
      return data.org.split(" ").slice(1).join(" ");
    } catch (err) {
      console.error("Error fetching ISP info:", err);
      return "Unknown ISP";
    }
  };

  useEffect(() => {
    const fetchISP = async () => {
      const userISP = await fetchUserISP();
      setUserISP(userISP);
    };
    fetchISP();
  }, []);

  const runSpeedTest = async () => {
    setIsLoading(true);
    setError("");
    setProgress(0); // Reset progress at the start

    try {
      const downloadStart = Date.now();
      const downloadInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 50)); // Increment by 1% until 50%
      }, 100); // Updates every 100ms

      const downloadResponse = await fetch("/api/speedtest?type=test");
      const downloadData = await downloadResponse.json();
      clearInterval(downloadInterval); // Clear the interval when done
      const downloadEnd = Date.now();
      const downloadDuration = (downloadEnd - downloadStart) / 1000; // seconds
      const downloadSpeed = (
        downloadData.testData.length /
        downloadDuration /
        125000
      ).toFixed(2); // Mbps

      setProgress(50); // Set progress to 50% after download completes

      // Set server location and test data
      setServerLocation(downloadData.serverLocation);
      setServer(downloadData.serverLocation);

      // Upload speed test with progress updates
      const uploadData = { testData: downloadData.testData };
      const uploadStart = Date.now();
      const uploadInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100)); // Increment by 1% until 100%
      }, 100); // Updates every 100ms

      await fetch("/api/speedtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });
      const uploadEnd = Date.now();
      clearInterval(uploadInterval); // Clear the interval when done

      const uploadDuration = (uploadEnd - uploadStart) / 1000; // seconds
      const uploadSpeed = (
        uploadData.testData.length /
        uploadDuration /
        125000
      ).toFixed(2); // Mbps

      setProgress(100); // Set progress to 100% after upload completes

      setResults({
        downloadSpeed: parseFloat(downloadSpeed),
        uploadSpeed: parseFloat(uploadSpeed),
      });
      setDownload(parseFloat(downloadSpeed));
      setUpload(parseFloat(uploadSpeed));
    } catch (err) {
      setError("Failed to run speed test. Please try again.");
    } finally {
      setIsLoading(false);
      // setTimeout(() => setProgress(100), 500);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Button
        onClick={runSpeedTest}
        disabled={isLoading}
        className="w-full bg-gray-700 relative overflow-clip"
        style={{
          background: `linear-gradient(to right, #60a5fa ${progress}%, #374151 ${progress}%)`,
          transition: "background 0.1s ease", // Smooth background change
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="animate-pulse">Running test...</span>
          </>
        ) : (
          "Start Speed Test"
        )}
      </Button>

      {error && <p className="text-red-500 mb-2">{error}</p>}
    </Card>
  );
};

export default SpeedTest;
