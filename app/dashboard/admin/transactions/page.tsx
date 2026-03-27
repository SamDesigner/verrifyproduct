    "use client";
import { useEffect, useState } from "react";
import { getAdminTransactions } from "@/lib/api/adminPayment";
import { useAuthReady } from "@/hooks/useAuthReady";

export default function AdminTransactionsPage() {
  const { isReady } = useAuthReady();
  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    setLoading(true);
    getAdminTransactions()
      .then((res) => {
        console.log("Admin Transactions:", res.data);
        const data = res.data as { data?: unknown[] } | unknown[];
        setTransactions(Array.isArray(data) ? data : (data as { data?: unknown[] })?.data ?? []);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady]);

  return (
    // style={{ background: "#0f1117" }}
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">All Transactions</h1>
        {!loading && (
          <p className="text-slate-400 text-sm mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Column headers */}
        <div className="px-6 py-3 grid text-xs font-semibold uppercase tracking-widest"
          style={{
            gridTemplateColumns: "160px 1fr 1fr 140px 180px 100px",
            color: "#475569",
            background: "#12161f",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          <span>Reference</span>
          <span>Order ID</span>
          <span>User</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {/* Loading */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-6 py-4 grid animate-pulse"
            style={{ gridTemplateColumns: "160px 1fr 1fr 140px 180px 100px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="h-3 w-28 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3 w-36 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-3 w-20 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3 w-36 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-6 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
        ))}

        {/* Error */}
        {!loading && error && (
          <div className="px-6 py-16 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-xs text-slate-400 underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && transactions.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No transactions yet</p>
          </div>
        )}

        {/* Rows */}
        {!loading && !error && transactions.length > 0 && (
          (transactions as Array<Record<string, unknown>>).map((tx, i) => {
            const status = String(tx.status ?? "—");
            const isSuccess = status === "SUCCESS";
            const isPending = status === "PENDING";
            const color = isSuccess ? "#34d399" : isPending ? "#f59e0b" : "#f87171";
            const bg = isSuccess ? "rgba(52,211,153,0.1)" : isPending ? "rgba(245,158,11,0.1)" : "rgba(248,113,113,0.1)";
            const border = isSuccess ? "rgba(52,211,153,0.2)" : isPending ? "rgba(245,158,11,0.2)" : "rgba(248,113,113,0.2)";
            const order = tx.order as Record<string, unknown> | undefined;
            const user = (order?.user ?? tx.user) as Record<string, unknown> | undefined;

            return (
              <div key={String(tx.id ?? i)}
                className="px-6 py-4 grid items-center gap-4 hover:bg-white/2 transition-colors"
                style={{ gridTemplateColumns: "160px 1fr 1fr 140px 180px 100px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-slate-300 text-xs font-mono truncate">
                  {String(tx.paystackReference ?? tx.reference ?? "—")}
                </span>
                <span className="text-slate-400 text-xs font-mono truncate">
                  {String(order?.id ?? "—")}
                </span>
                <span className="text-slate-400 text-xs truncate">
                  {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "—"}
                </span>
                <span className="text-white text-xs font-semibold">
                  {tx.amount ? `₦${Number(tx.amount).toLocaleString()}` : "—"}
                </span>
                <span className="text-slate-500 text-xs">
                  {tx.createdAt ? new Date(String(tx.createdAt)).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  }) : "—"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{ color, background: bg, border: `1px solid ${border}` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  {status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}