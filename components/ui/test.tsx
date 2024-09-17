"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SpeedTest from "../wrapper/SpeedTest";

import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

type SpeedPointFormData = {
  isp: string;
  advertised: number;
  download: number;
  upload: number;
  lat: number | null;
  lng: number | null;
};

export default function SpeedPointForm() {
  const [formData, setFormData] = useState<SpeedPointFormData>({
    isp: "",
    advertised: 0,
    download: 0,
    upload: 0,
    lat: null,
    lng: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
          setLoading(false);
        },
        (err) => {
          setError("Error getting location: " + err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "isp" ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.lat === null || formData.lng === null) {
      setError("Location data is not available. Please try again.");
      return;
    }
    try {
      const speedPointsCollection = collection(db, "speedPoints");
      await addDoc(speedPointsCollection, formData);
      setFormData({
        isp: "",
        advertised: 0,
        download: 0,
        upload: 0,
        lat: null,
        lng: null,
      });
      console.log("Speed point added successfully!");
    } catch (error) {
      console.error("Error adding speed point:", error);
      setError("Failed to add speed point. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading location data...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>
        ISP:
        <input type="text" name="isp" value={formData.isp} onChange={handleChange} required />
      </label>
      <label>
        Advertised Speed:
        <input type="number" name="advertised" value={formData.advertised} onChange={handleChange} required />
      </label>
      <label>
        Download Speed:
        <input type="number" name="download" value={formData.download} onChange={handleChange} required />
      </label>
      <label>
        Upload Speed:
        <input type="number" name="upload" value={formData.upload} onChange={handleChange} required />
      </label>
      <p>Latitude: {formData.lat !== null ? formData.lat.toFixed(6) : 'Not available'}</p>
      <p>Longitude: {formData.lng !== null ? formData.lng.toFixed(6) : 'Not available'}</p>
      <button type="submit" disabled={formData.lat === null || formData.lng === null}>Add Speed Point</button>
    </form>
  );
}

export function TestForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Start Speed Test</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add your speed to the databse</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <SpeedTest />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SpeedPointForm />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
