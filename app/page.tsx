import Dashboard from "@/components/ui/map";
import SearchBar from "@/components/ui/search";
import { TestForm } from "@/components/ui/test";
import { GlobeDemo } from "@/components/wrapper/GlobeWrapper";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      {/* <GlobeDemo /> */}
      <div className="w-[90vw] h-[75vh] md:w-[75vw] flex flex-col gap-4">
        <div className="w-full flex flex-row">
          <SearchBar />
          <TestForm />
        </div>
        <div className="rounded-2xl overflow-clip w-full h-full">
          <Dashboard />
        </div>
      </div>
    </main>
  );
}
