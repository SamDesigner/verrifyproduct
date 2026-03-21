import { Skeleton } from "./DashboardHelpers";

export interface Transaction {
  id: string;
  paystackReference?: string;
  amount?: string;
  createdAt?: string;
  status?: string;
}

interface DashboardTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

export function DashboardTransactions({ transactions, loading }: DashboardTransactionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-white font-semibold text-sm">Recent Transactions</p>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Header */}
        <div
          className="grid px-4 py-3 text-xs font-semibold uppercase tracking-widest"
          style={{
            gridTemplateColumns: "1fr 100px 80px",
            color: "#475569",
            background: "#12161f",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span>Reference</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid px-4 py-3 animate-pulse"
              style={{ gridTemplateColumns: "1fr 100px 80px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))
        ) : transactions.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-slate-500 text-sm">No transactions yet</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((tx, i) => (
            <div
              key={tx.id ?? i}
              className="grid items-center px-4 py-3 hover:bg-white/2 transition-colors"
              style={{ gridTemplateColumns: "1fr 100px 80px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="text-slate-300 text-xs font-mono truncate">
                {tx.paystackReference ?? "—"}
              </span>
              <span className="text-slate-300 text-xs">
                {tx.amount ? `₦${Number(tx.amount).toLocaleString()}` : "—"}
              </span>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold w-fit"
                style={{
                  background: tx.status === "SUCCESS" ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.1)",
                  color: tx.status === "SUCCESS" ? "#34d399" : "#f59e0b",
                  border: `1px solid ${tx.status === "SUCCESS" ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.2)"}`,
                }}
              >
                {tx.status ?? "—"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}