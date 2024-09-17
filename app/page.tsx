import { GlobeDemo } from "@/components/wrapper/GlobeWrapper";
import Dashboard from "@/components/wrapper/Dashboard";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <GlobeDemo />
      <div className="h-screen py-5">
      <Dashboard />
      </div>
      
    </main>
  );
}
