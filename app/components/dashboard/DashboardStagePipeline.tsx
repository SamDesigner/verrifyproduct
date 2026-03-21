import { MyRequestItem } from "@/lib/types/verification";
import { ALL_STAGES,  Skeleton, formatDate, timeAgo } from "./DashboardHelpers";
import { DashboardStageBadge } from "./DashboardStageBadge";

interface DashboardStagePipelineProps {
  requests: MyRequestItem[];
  loading: boolean;
  onView: (id: string) => void;
  onStartNew: () => void;
}

function PipelineCard({ item, onView }: { item: MyRequestItem; onView: (id: string) => void }) {
  const completedStages = new Set(item.stageHistory.map((h) => h.stage));
  const isRejected = item.stage === "VERIFICATION_REJECTED";

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-150"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      onClick={() => onView(item.id)}
      onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{item.property.name}</p>
          <p className="text-slate-500 text-xs mt-0.5 truncate">
            {[item.property.address, item.property.city, item.property.state].filter(Boolean).join(", ")}
          </p>
        </div>
        <DashboardStageBadge stage={item.stage} />
      </div>

      {/* Rejected state */}
      {isRejected ? (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-red-400 text-xs font-medium">Verification was rejected</p>
        </div>
      ) : (
        /* Horizontal pipeline */
        <div className="flex items-center w-full overflow-x-auto pb-1">
          {ALL_STAGES.map((stage, i) => {
            const isCompleted = completedStages.has(stage.key);
            const isCurrent = stage.key === item.stage;
            const isLast = i === ALL_STAGES.length - 1;
            const nextCompleted = completedStages.has(ALL_STAGES[i + 1]?.key);
            const historyEntry = item.stageHistory.find((h) => h.stage === stage.key);

            return (
              <div key={stage.key} className="flex items-center shrink-0">
                {/* Stage node */}
                <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 64 }}>
                  {/* Circle */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isCompleted ? "rgba(52,211,153,0.15)" : isCurrent ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                      border: isCompleted ? "2px solid #34d399" : isCurrent ? "2px solid #818cf8" : "2px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {isCompleted ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#818cf8" }} />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className="text-center leading-tight"
                    style={{
                      fontSize: 9,
                      fontWeight: isCompleted || isCurrent ? 600 : 400,
                      color: isCompleted ? "#34d399" : isCurrent ? "#c7d2fe" : "#334155",
                      maxWidth: 56,
                    }}
                  >
                    {stage.label}
                  </p>

                  {/* Date if completed */}
                  {historyEntry && (
                    <p style={{ fontSize: 8, color: "#475569" }}>
                      {formatDate(historyEntry.completedAt)}
                    </p>
                  )}
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className="shrink-0 transition-all duration-300"
                    style={{
                      width: 20, height: 2, borderRadius: 1,
                      background: isCompleted && nextCompleted ? "#34d399" : isCurrent ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                      marginBottom: 28,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-slate-600 text-xs">Last updated {timeAgo(item.updatedAt)}</p>
    </div>
  );
}

export function DashboardStagePipeline({
  requests, loading, onView, onStartNew,
}: DashboardStagePipelineProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold text-sm">Property Stage History</p>
        <button
          onClick={() => onView("all")}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all →
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 space-y-4 animate-pulse"
              style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="flex flex-col items-center gap-1.5">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl px-6 py-12 text-center"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-slate-500 text-sm">No verification requests yet</p>
          <button onClick={onStartNew} className="mt-3 text-xs text-indigo-400 underline">
            Start your first verification
          </button>
        </div>
      ) : (
        requests.slice(0, 5).map((item) => (
          <PipelineCard key={item.id} item={item} onView={onView} />
        ))
      )}
    </div>
  );
}