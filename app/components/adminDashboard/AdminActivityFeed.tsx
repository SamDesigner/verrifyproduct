import { stageLabel, stageColor } from "./adminDashboardHelpers";

interface FeedItem {
  stage: string;
  propertyName: string;
  completedAt: string;
}

interface Props {
  feed: FeedItem[];
  loading: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AdminActivityFeed({ feed, loading }: Props) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-white font-semibold text-sm">Recent Activity</p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="h-3 rounded animate-pulse flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-3 w-12 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>
      ) : feed.length === 0 ? (
        <p className="text-slate-600 text-xs text-center py-6">No recent activity</p>
      ) : (
        <div className="flex flex-col gap-3">
          {feed.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: stageColor(item.stage) }}
              />
              <p className="text-slate-300 text-xs flex-1 truncate">
                <span className="font-medium" style={{ color: stageColor(item.stage) }}>
                  {stageLabel(item.stage)}
                </span>
                {" — "}
                {item.propertyName}
              </p>
              <p className="text-slate-600 text-xs shrink-0">{timeAgo(item.completedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}