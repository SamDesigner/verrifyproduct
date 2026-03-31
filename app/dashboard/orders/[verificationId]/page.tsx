"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getOrderByVerificationId } from "@/lib/api/payment";
import { useAuthReady } from "@/hooks/useAuthReady";

// ── Types ──────────────────────────────────────────────────────────────────

interface StageHistory {
  stage: string;
  completedAt: string;
}

interface PropertyVerification {
  id: string;
  stage: string;
  caseId: string | null;
  adminComments: string | null;
  reviewedAt: string | null;
  createdAt: string;
  stageHistory: StageHistory[];
}

interface OrderTransaction {
  id: string;
  createdAt: string;
  amount: string;
  paystackReference: string;
  status: string;
  authorizationUrl: string | null;
}

interface OrderDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  amount: string;
  currency: string;
  status: string;
  transactions?: OrderTransaction[];
  propertyVerification: PropertyVerification;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Sub-components — defined OUTSIDE the page component ───────────────────

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500 text-xs shrink-0">{label}</span>
      <span className="text-slate-300 text-xs font-medium text-right break-all">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      // style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}

    >
      <p
        className="text-xs font-semibold uppercase tracking-widest text-slate-500 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isSuccess = status === "SUCCESS";
  const isPending = status === "PENDING";
  const color = isSuccess ? "#34d399" : isPending ? "#f59e0b" : "#f87171";
  const bg = isSuccess ? "rgba(52,211,153,0.1)" : isPending ? "rgba(245,158,11,0.1)" : "rgba(248,113,113,0.1)";
  const border = isSuccess ? "rgba(52,211,153,0.2)" : isPending ? "rgba(245,158,11,0.2)" : "rgba(248,113,113,0.2)";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-5 space-y-3"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="h-3 w-24 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="flex justify-between gap-4">
              <div className="h-2.5 w-20 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-2.5 w-28 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const router = useRouter();
  const { verificationId } = useParams<{ verificationId: string }>();
  const { isReady } = useAuthReady();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !verificationId) return;
    setLoading(true);
    getOrderByVerificationId(verificationId)
      .then((res) => {
        console.log("Order Detail:", res.data);
        setOrder(res.data as OrderDetail);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady, verificationId]);

  return (
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 shrink-0 cursor-pointer"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e2535")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#161b27")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Details</h1>
          {order && !loading && (
            <p className="text-slate-500 text-xs mt-0.5 truncate">ID: {order.id}</p>
          )}
        </div>

        {order && !loading && (
          <StatusBadge status={order.status} />
        )}
      </div>

      {/* Content */}
      {loading ? (
        <DetailSkeleton />
      ) : error ? (
        <div className="rounded-2xl px-6 py-16 text-center"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => router.back()} className="mt-3 text-xs text-slate-400 underline">
            Go back
          </button>
        </div>
      ) : order ? (
        <div className="space-y-4">

          {/* Row 1: Order + Verification info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Order Info">
              <DetailRow label="Order ID" value={order.id} />
              <DetailRow label="Amount" value={`₦${Number(order.amount).toLocaleString()}`} />
              <DetailRow label="Currency" value={order.currency} />
              <DetailRow label="Status" value={order.status} />
              <DetailRow label="Created" value={formatDate(order.createdAt)} />
              <DetailRow label="Updated" value={formatDate(order.updatedAt)} />
            </SectionCard>

            <SectionCard title="Property Verification">
              <DetailRow label="Verification ID" value={order.propertyVerification?.id} />
              <DetailRow label="Stage" value={order.propertyVerification?.stage?.replace(/_/g, " ")} />
              <DetailRow label="Case ID" value={order.propertyVerification?.caseId} />
              <DetailRow label="Admin Comments" value={order.propertyVerification?.adminComments} />
              <DetailRow label="Reviewed At" value={order.propertyVerification?.reviewedAt ? formatDate(order.propertyVerification.reviewedAt) : null} />
              <DetailRow label="Created" value={order.propertyVerification?.createdAt ? formatDate(order.propertyVerification.createdAt) : null} />
            </SectionCard>
          </div>

          {/* Transactions table */}
          {order.transactions && order.transactions.length > 0 && (
            <div className="rounded-2xl overflow-x-auto md:overflow-hidden "
              // style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}

            >
              <div className="px-5 py-3 text-xs font-semibold uppercase tracking-widest w-full!"
                style={{ color: "#475569", background: "#12161f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                Transactions
              </div>
              <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-widest"
                style={{ gridTemplateColumns: "1fr 140px 180px 100px", color: "#475569", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span>Reference</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Status</span>
              </div>
              {order.transactions.map((tx) => {
                const isSuccess = tx.status === "SUCCESS";
                const isPending = tx.status === "PENDING";
                const color = isSuccess ? "#34d399" : isPending ? "#f59e0b" : "#f87171";
                const bg = isSuccess ? "rgba(52,211,153,0.1)" : isPending ? "rgba(245,158,11,0.1)" : "rgba(248,113,113,0.1)";
                const border = isSuccess ? "rgba(52,211,153,0.2)" : isPending ? "rgba(245,158,11,0.2)" : "rgba(248,113,113,0.2)";
                return (
                  <div key={tx.id} className="grid items-center px-5 py-3 hover:bg-white/2 "
                    style={{ gridTemplateColumns: "1fr 140px 180px 100px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-slate-300 text-xs font-mono truncate">{tx.paystackReference ?? "—"}</span>
                    <span className="text-white text-xs font-semibold">₦{Number(tx.amount).toLocaleString()}</span>
                    <span className="text-slate-500 text-xs">{formatDate(tx.createdAt)}</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                      style={{ color, background: bg, border: `1px solid ${border}` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      {tx.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}