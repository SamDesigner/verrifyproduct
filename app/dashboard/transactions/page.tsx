"use client";
import { useEffect, useState } from "react";
import { getMyTransactions } from "@/lib/api/payment";
import { useAuthReady } from "@/hooks/useAuthReady";


// ── Types ──────────────────────────────────────────────────────────────────

interface TransactionOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount: string;
  currency: string;
  status: string;
}

interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount: string;
  paystackReference: string;
  status: string;
  authorizationUrl: string | null;
  order: TransactionOrder;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  
  const isSuccess = status === "SUCCESS";
  const isPending = status === "PENDING";
  const color = isSuccess ? "#34d399" : isPending ? "#f59e0b" : "#f87171";
  const bg = isSuccess ? "rgba(52,211,153,0.1)" : isPending ? "rgba(245,158,11,0.1)" : "rgba(248,113,113,0.1)";
  const border = isSuccess ? "rgba(52,211,153,0.2)" : isPending ? "rgba(245,158,11,0.2)" : "rgba(248,113,113,0.2)";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      className="px-6 py-4 grid items-center gap-4 animate-pulse"
      style={{
        gridTemplateColumns: "160px 1fr 140px 180px 100px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="h-3 w-28 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="h-3 w-20 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="h-3 w-36 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="h-6 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { isReady } = useAuthReady();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    getMyTransactions()
      .then((res) => {
        const data = res.data as { data?: Transaction[] } | Transaction[];
        setTransactions(Array.isArray(data) ? data : (data as { data?: Transaction[] })?.data ?? []);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady]);

  return (
    // style={{ background: "#0f1117" }}
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
        {!loading && (
          <p className="text-slate-400 text-sm mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Summary cards */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Total Transactions",
              value: transactions.length,
              color: "#818cf8",
              bg: "rgba(99,102,241,0.08)",
              border: "rgba(99,102,241,0.2)",
            },
            {
              label: "Total Amount",
              value: `₦${transactions.reduce((acc, tx) => acc + Number(tx.amount), 0).toLocaleString()}`,
              color: "#34d399",
              bg: "rgba(52,211,153,0.08)",
              border: "rgba(52,211,153,0.2)",
            },
            {
              label: "Pending",
              value: transactions.filter((tx) => tx.status === "PENDING").length,
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.08)",
              border: "rgba(245,158,11,0.2)",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl px-5 py-4 flex items-center justify-between"
              style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-slate-500 text-xs font-medium">{label}</p>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Column headers */}
        <div
          className="px-6 py-3 grid text-xs font-semibold uppercase tracking-widest"
          style={{
            gridTemplateColumns: "160px 1fr 140px 180px 100px",
            color: "#475569",
            background: "#12161f",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span>Reference</span>
          <span>Order ID</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {/* Loading skeletons */}
        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

        {/* Error */}
        {!loading && error && (
          <div className="px-6 py-16 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs text-slate-400 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && transactions.length === 0 && (
          <div className="px-6 py-16 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No transactions yet</p>
          </div>
        )}

        {/* Rows */}
        {!loading && !error && transactions.map((tx) => (
          <div
            key={tx.id}
            className="px-6 py-4 grid items-center gap-4 transition-colors hover:bg-white/2"
            style={{
              gridTemplateColumns: "160px 1fr 140px 180px 100px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Reference */}
            <span className="text-slate-300 text-xs font-mono truncate">
              {tx.paystackReference ?? "—"}
            </span>

            {/* Order ID */}
            <span className="text-slate-400 text-xs font-mono truncate">
              {tx.order?.id ?? "—"}
            </span>

            {/* Amount */}
            <div>
              <p className="text-white text-xs font-semibold">
                ₦{Number(tx.amount).toLocaleString()}
              </p>
              <p className="text-slate-600 text-xs mt-0.5">
                {tx.order?.currency ?? "NGN"}
              </p>
            </div>

            {/* Date */}
            <span className="text-slate-500 text-xs">{formatDate(tx.createdAt)}</span>

            {/* Status */}
            <StatusBadge status={tx.status} />
          </div>
        ))}
      </div>
    </div>
  );
}