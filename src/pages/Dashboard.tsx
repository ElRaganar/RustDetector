import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsPanel from "./dashboard/StatsPanel";
import UploadCard from "./dashboard/UploadCard";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#F8F9FB]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-7">
            <UploadCard />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <StatsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
