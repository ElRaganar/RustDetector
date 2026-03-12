import { useState } from "react";
import Sidebar from "../../components/Sidebar"; // Adjust this path if needed based on your folder structure
import Topbar from "../../components/Topbar";   // Adjust this path if needed based on your folder structure
import StatsPanel from "./StatsPanel";
import UploadCard from "./UploadCard";

// Exporting the interfaces so UploadCard, StatsPanel, and App can use them
export interface InferenceResult {
  originalFile: string;
  annotatedImage: string;
  detections: {
    slippage: number;
    corrosion: number;
    crack: number;
  };
}

export interface DashboardStats {
  totalScans: number;
  criticalRust: number;
  totalDetections: number;
}

// 1. Define the props we are now receiving from App.tsx
interface DashboardProps {
  results: InferenceResult[];
  setResults: React.Dispatch<React.SetStateAction<InferenceResult[]>>;
  stats: DashboardStats;
  setStats: React.Dispatch<React.SetStateAction<DashboardStats>>;
}

// 2. Accept the props here instead of initializing local state
const Dashboard = ({ results, setResults, stats, setStats }: DashboardProps) => {
  
  // 3. We keep isProcessing local because the loading spinner only matters on this page
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="dash flex h-screen bg-[#0a0a0a]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Topbar />
        <main className="flex-1 p-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
            
            {/* Upload Area */}
            <UploadCard 
              setResults={setResults} 
              isProcessing={isProcessing} 
              setIsProcessing={setIsProcessing} 
              setStats={setStats} 
            />

            {/* Results Display Area */}
            {results.length > 0 && (
              <div className="bg-[#121212] p-6 rounded-3xl border border-[rgba(232,124,62,0.12)]">
                <h3 className="text-white font-['Bebas_Neue'] text-2xl tracking-wide mb-4">
                  Scan Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((res, idx) => (
                    <div key={idx} className="flex flex-col gap-3 p-4 bg-black/40 rounded-xl border border-white/5">
                      <img 
                        src={res.annotatedImage} 
                        alt={`Detection result ${idx + 1}`} 
                        className="w-full h-auto rounded-lg object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-[#e87c3e] text-xs uppercase tracking-widest font-bold">
                          Detections Found
                        </span>
                        <div className="flex gap-3 text-sm text-gray-300">
                           <span className={res.detections.slippage > 0 ? "text-orange-500 font-bold" : ""}>
                             Slippage: {res.detections.slippage}
                           </span>
                           <span className={res.detections.corrosion > 0 ? "text-red-500 font-bold" : ""}>
                             Corrosion: {res.detections.corrosion}
                           </span>
                           <span className={res.detections.crack > 0 ? "text-cyan-500 font-bold" : ""}>
                             Crack: {res.detections.crack}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
          
          {/* Stats Panel Area */}
          <div className="col-span-12 xl:col-span-5">
            <StatsPanel stats={stats} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;