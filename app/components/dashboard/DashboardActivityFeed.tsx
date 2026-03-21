import { STAGE_CONFIG, Skeleton, timeAgo } from "./DashboardHelpers";

interface ActivityEntry {
  stage: string;
  propertyName: string;
  completedAt: string;
}

interface DashboardActivityFeedProps {
  feed: ActivityEntry[];
  loading: boolean;
}

function ActivityItem({ stage, propertyName, completedAt }: ActivityEntry) {
  const s = STAGE_CONFIG[stage] ?? { color: "#94a3b8", label: stage };
  return (
    <div
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
        style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 text-xs">
          <span className="text-white font-medium">{propertyName}</span>{" "}
          moved to{" "}
          <span style={{ color: s.color }} className="font-medium">{s.label}</span>
        </p>
        <p className="text-slate-600 text-xs mt-0.5">{timeAgo(completedAt)}</p>
      </div>
    </div>
  );
}

export function DashboardActivityFeed({ feed, loading }: DashboardActivityFeedProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-white font-semibold text-sm">Recent Activity</p>
      <div
        className="rounded-2xl p-4"
        style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {loading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-3 animate-pulse"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : feed.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-8">No activity yet</p>
        ) : (
          feed.map((activity, i) => (
            <ActivityItem key={i} {...activity} />
          ))
        )}
      </div>
    </div>
  );
}