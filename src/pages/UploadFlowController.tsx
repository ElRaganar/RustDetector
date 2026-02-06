import { useState } from "react";
import UploadCard from "./dashboard/UploadCard";
import SummaryBar from "./SummaryBar";
import ProgressScreen from "./ProgressScreen";
import AIProcessingScreen from "./AIProcessingScreen";

export interface PreviewFile {
  file: File;
  url: string;
  valid: boolean;
}

const UploadFlowController = () => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [step, setStep] = useState<"UPLOAD" | "PROGRESS" | "PROCESSING">(
    "UPLOAD",
  );

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] p-6">
      {step === "UPLOAD" && (
        <>
          <UploadCard files={files} setFiles={setFiles} />

          {files.length > 0 && (
            <SummaryBar
              files={files}
              onAddMore={() => setStep("UPLOAD")}
              onContinue={() => setStep("PROGRESS")}
            />
          )}
        </>
      )}

      {step === "PROGRESS" && (
        <ProgressScreen
          files={files}
          onComplete={() => setStep("PROCESSING")}
        />
      )}

      {step === "PROCESSING" && <AIProcessingScreen />}
    </div>
  );
};

export default UploadFlowController;
