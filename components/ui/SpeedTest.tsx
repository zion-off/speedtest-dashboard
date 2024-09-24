"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  setSpeedTestError: Dispatch<SetStateAction<string>>;
}

const SpeedTest: React.FC<SpeedTestProps> = ({
  setDownload,
  setUpload,
  setServer,
  setUserISP,
  setSpeedTestError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ downloadSpeed: 0, uploadSpeed: 0 });
  const [serverLocation, setServerLocation] = useState<ServerLocation | null>(
    null
  );
  const [progress, setProgress] = useState(0); // State variable for progress

  async function resolveHostname(hostname: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://dns.google/resolve?name=${hostname}`
      );
      const data = await response.json();
      return data.Answer[0].data;
    } catch (error) {
      console.error("Error resolving hostname:", error);
      return null;
    }
  }

  async function getServerLocation(
    ipAddress: string
  ): Promise<ServerLocation | null> {
    try {
      const response = await fetch("/api/getserverlocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ipAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch server location");
      }

      const data = await response.json();
      return data.location;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

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
    setSpeedTestError("");
    setProgress(0);

    try {
      // ----------------- Download Test -----------------
      const downloadStart = Date.now();
      const downloadInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 40)); // Increment progress up to 50%
      }, 200);

      const response = await fetch(
        `https://speed-test-files.zzzzion.com/data-30-mb.txt?timestamp=${Date.now()}`
      );
      const downloadData = await response.blob(); // Get the file as a Blob

      clearInterval(downloadInterval);
      const downloadEnd = Date.now();
      const downloadDuration = (downloadEnd - downloadStart) / 1000;

      // Convert the blob size to Mbps
      const downloadSpeed = (
        downloadData.size /
        downloadDuration /
        125000
      ).toFixed(2);

      setProgress(50);
      setDownload(parseFloat(downloadSpeed));

      const serverInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 60));
      }, 50);

      const serverHostname = new URL(response.url).hostname; // Get the hostname
      const serverIp = await resolveHostname(serverHostname); // Resolve the hostname
      if (serverIp) {
        const serverLocation = await getServerLocation(serverIp); // Fetch server location
        if (serverLocation) {
          setServerLocation(serverLocation);
          setServer(serverLocation);
        }
      }

      clearInterval(serverInterval);

      // ----------------- Upload Test -----------------
      const uploadStart = Date.now();
      const uploadInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 95)); // Increment progress to 100%
      }, 200);

      // Dummy upload to a public API (simulates upload)
      const formData = new FormData();
      formData.append("file", downloadData, "test-file.bin"); // Upload the downloaded data

      // POST request to the Cloudflare worker
      await fetch("speed-test-upload.zzzzion.workers.dev", {
        method: "POST",
        body: formData,
      });

      setProgress(100);

      const uploadEnd = Date.now();
      clearInterval(uploadInterval);

      const uploadDuration = (uploadEnd - uploadStart) / 1000;
      const uploadSpeed = (downloadData.size / uploadDuration / 125000).toFixed(
        2
      );

      setProgress(100);
      setResults({
        downloadSpeed: parseFloat(downloadSpeed),
        uploadSpeed: parseFloat(uploadSpeed),
      });

      setUpload(parseFloat(uploadSpeed));
    } catch (err) {
      setSpeedTestError("Failed to run speed test. Reload and try again?");
      setProgress(0);
    } finally {
      setIsLoading(false);
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
        ) : progress == 100 ? (
          "Rerun test"
        ) : (
          "Start Speed Test"
        )}
      </Button>
    </Card>
  );
};

export default SpeedTest;
