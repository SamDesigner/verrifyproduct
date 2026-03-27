import { VerificationItem } from "@/lib/types/verification";
import { timeAgo } from "./adminDashboardHelpers";

interface Props {
  items: VerificationItem[];
  loading: boolean;
  onView: (id: string) => void;
}

export function AdminPendingVerdicts({ items, loading, onView }: Props) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold text-sm">Pending Verdicts</p>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.2)" }}
        >
          {items.length} in review
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg animate-pulse shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3 w-36 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2.5 w-24 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-slate-600 text-xs">No pending verdicts</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-white text-xs font-medium truncate">{item.property.name}</p>
                <p className="text-slate-500 text-xs truncate">
                  {[item.property.city, item.property.state].filter(Boolean).join(", ")} · {timeAgo(item.updatedAt)}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => onView(item.id)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all duration-150"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
              >
                Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}