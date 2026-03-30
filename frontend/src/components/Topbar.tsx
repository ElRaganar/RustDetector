import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, AlertTriangle } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import type { InferenceResult } from "../pages/dashboard/Dashboard";

interface TopbarProps {
  results: InferenceResult[];
}

const Topbar = ({ results }: TopbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownWrapperRef = useRef<HTMLDivElement | null>(null);

  const flaggedResults = useMemo(
    () =>
      results.filter((result) => {
        const totalDetections =
          result.detections.corrosion +
          result.detections.slippage +
          result.detections.crack;

        return totalDetections > 0;
      }),
    [results],
  );

  useEffect(() => {
    if (!showDropdown) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownWrapperRef.current?.contains(target)) return;

      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showDropdown]);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white border-b px-8 flex items-center justify-between overflow-visible">
        {/* Left: Page title */}
        <div>
          <h2 className="text-xl font-semibold text-[#2B2D42]">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Upload images & monitor rust detection
          </p>
        </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
          <div ref={dropdownWrapperRef} className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className={`relative p-2 rounded-xl transition ${
                showDropdown ? "bg-[#e87c3e] shadow-lg shadow-[#e87c3e]/30" : "hover:bg-gray-100"
              }`}
              aria-label="Show high risk images"
            >
              <Bell
                size={20}
                className={showDropdown ? "text-white" : "text-gray-600"}
              />
              {flaggedResults.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] leading-4 text-white font-semibold text-center">
                  {flaggedResults.length}
                </span>
              )}
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 top-full z-[200] mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(232,124,62,0.98) 0%, rgba(193,88,31,0.98) 100%)",
                  borderColor: "rgba(255,255,255,0.18)",
                  boxShadow: "0 24px 60px rgba(92, 33, 5, 0.35)",
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.16)" }}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">Risk Images</p>
                    <p className="text-xs text-orange-100/90">
                      {flaggedResults.length} item{flaggedResults.length !== 1 ? "s" : ""} in this session
                    </p>
                  </div>
                  <div className="rounded-full bg-white/15 p-2">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                </div>

                {flaggedResults.length > 0 ? (
                  <div className="max-h-[26rem] space-y-3 overflow-y-auto p-3">
                    {flaggedResults.map((result, index) => {
                      const totalDetections =
                        result.detections.corrosion +
                        result.detections.slippage +
                        result.detections.crack;
                      const riskLevel =
                        result.detections.corrosion > 0 || totalDetections >= 3
                          ? "High"
                          : "Medium";

                      return (
                        <div
                          key={`${result.annotatedImage}-${index}`}
                          className={`rounded-2xl p-3 shadow-lg ${
                            riskLevel === "High"
                              ? "border border-white/20 bg-[#fff4ef]"
                              : "border border-white/20 bg-[#fff8ee]"
                          }`}
                        >
                          <img
                            src={result.annotatedImage}
                            alt={`${riskLevel} risk scan ${index + 1}`}
                            className="h-40 w-full rounded-xl object-cover"
                          />
                          <div className="mt-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#2B2D42]">
                                {riskLevel} Risk Scan {index + 1}
                              </p>
                              <p className="text-xs text-gray-600">
                                Corrosion: {result.detections.corrosion} | Slippage: {result.detections.slippage} | Crack: {result.detections.crack}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white ${
                                riskLevel === "High" ? "bg-[#d62828]" : "bg-[#f77f00]"
                              }`}
                            >
                              {riskLevel} Risk
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-white">No risk images yet</p>
                    <p className="mt-1 text-xs text-orange-100/90">
                      Analyze images and medium or high risk results will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </header>

    </>
  );
};

export default Topbar;
