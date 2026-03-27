import { VerificationItem } from "@/lib/types/verification";
import { timeAgo } from "./adminDashboardHelpers";

interface Props {
  items: VerificationItem[];
  loading: boolean;
}

export function AdminTransactionsList({ items, loading }: Props) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-white font-semibold text-sm">Recent Transactions</p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg animate-pulse shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3 w-40 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2.5 w-24 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div className="h-5 w-28 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-slate-600 text-xs text-center py-6">No recent transactions</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const isPaid = item.stage === "PAYMENT_VERIFIED";
            return (
              <div key={item.id} className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: isPaid ? "rgba(52,211,153,0.08)" : "rgba(245,158,11,0.08)",
                    border: isPaid ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isPaid ? "#34d399" : "#f59e0b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-white text-xs font-medium truncate">{item.property.name}</p>
                  <p className="text-slate-500 text-xs">{timeAgo(item.updatedAt)}</p>
                </div>

                {/* Status badge */}
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                  style={{
                    background: isPaid ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.1)",
                    color: isPaid ? "#34d399" : "#f59e0b",
                    border: isPaid ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  {isPaid ? "Payment Verified" : "Pending Payment"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}