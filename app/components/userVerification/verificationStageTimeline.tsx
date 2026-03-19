import { StageHistory } from "@/lib/types/verification";

interface VerificationStageTimelineProps {
  stageHistory: StageHistory[];
  currentStage: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VerificationStageTimeline({
  stageHistory,
  currentStage,
}: VerificationStageTimelineProps) {
  const isCurrentInHistory =
    stageHistory[stageHistory.length - 1]?.stage === currentStage;

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      <div className="space-y-4">
        {stageHistory.map((h, i) => {
          const isLast = i === stageHistory.length - 1 && isCurrentInHistory;
          return (
            <div key={i} className="flex items-start gap-4 relative">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10"
                style={{
                  background: isLast ? "#818cf8" : "#1e293b",
                  border: isLast
                    ? "2px solid #818cf8"
                    : "2px solid rgba(255,255,255,0.12)",
                }}
              />
              <div className="flex-1 flex items-start justify-between gap-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: isLast ? "#c7d2fe" : "#64748b" }}
                >
                  {h.stage.replace(/_/g, " ")}
                </span>
                {h.completedAt && (
                  <span className="text-xs text-slate-600 shrink-0">
                    {formatDate(h.completedAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Current stage if not already in history */}
        {!isCurrentInHistory && (
          <div className="flex items-start gap-4 relative">
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10 animate-pulse"
              style={{ background: "#818cf8", border: "2px solid #818cf8" }}
            />
            <span className="text-xs font-medium text-indigo-400">
              {currentStage.replace(/_/g, " ")}{" "}
              <span className="text-slate-600">(current)</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}