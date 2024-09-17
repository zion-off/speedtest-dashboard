import MapBox from "@/components/ui/map";
import SearchBar from "@/components/ui/search";
import { TestForm } from "@/components/ui/test";

const Dashboard = () => {
  return (
    <div className="w-[90vw] h-[75vh] md:w-[75vw] flex flex-col gap-4">
      <div className="w-full flex flex-row gap-2">
        <SearchBar />
        <TestForm />
      </div>
      <div className="rounded-2xl overflow-clip w-full h-full">
        <MapBox />
      </div>
    </div>
  );
};

export default Dashboard;
