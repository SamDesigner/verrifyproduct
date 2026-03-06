import { StageHistory } from "@/lib/types/verification";
import { DetailCard } from "./DetailCard";

interface StageTimelineProps {
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

export function StageTimeline({ stageHistory, currentStage }: StageTimelineProps) {
  return (
    <DetailCard title="Stage History">
      {stageHistory.length === 0 ? (
        <p className="text-slate-500 text-xs">No history available</p>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <div className="space-y-4">
            {stageHistory.map((h, i) => {
              const isLast = i === stageHistory.length - 1;
              return (
                <div key={i} className="flex items-start gap-4 relative">
                  {/* Dot */}
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10"
                    style={{
                      background: isLast ? "#818cf8" : "#1e293b",
                      border: isLast
                        ? "2px solid #818cf8"
                        : "2px solid rgba(255,255,255,0.15)",
                    }}
                  />
                  <div className="flex-1 flex items-start justify-between gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: isLast ? "#c7d2fe" : "#94a3b8" }}
                    >
                      {h.stage}
                    </span>
                    {h.completedAt && (
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatDate(h.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Current stage if not already in history */}
            {stageHistory[stageHistory.length - 1]?.stage !== currentStage && (
              <div className="flex items-start gap-4 relative">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10 animate-pulse"
                  style={{ background: "#818cf8", border: "2px solid #818cf8" }}
                />
                <span className="text-xs font-medium text-indigo-400">
                  {currentStage} <span className="text-slate-500">(current)</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </DetailCard>
  );
}