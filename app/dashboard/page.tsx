"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyVerificationRequests } from "@/lib/api/verification";
import { getMyTransactions } from "@/lib/api/payment";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import { MyRequestItem } from "@/lib/types/verification";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  INITIATED:             { label: "Initiated",          color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"  },
  PENDING_ACCEPTANCE:    { label: "Pending Acceptance", color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
  IN_REVIEW:             { label: "In Review",          color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  VERIFICATION_ACCEPTED: { label: "Accepted",           color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  VERIFICATION_REJECTED: { label: "Rejected",           color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  PENDING_PAYMENT:       { label: "Pending Payment",    color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)"  },
  PAYMENT_VERIFIED:      { label: "Payment Verified",   color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  VERIFICATION_COMPLETE: { label: "Complete",           color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
};

function StageBadge({ stage }: { stage: string }) {
  const s = STAGE_CONFIG[stage] ?? { label: stage, color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-lg ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }} />
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, color, bg, border, icon, loading }: {
  label: string; value: number; color: string; bg: string; border: string;
  icon: React.ReactNode; loading: boolean;
}) {
  return (
    <div className="rounded-2xl p-5 flex items-center justify-between gap-4"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div>
        <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg, border: `1px solid ${border}`, color }}>
        {icon}
      </div>
    </div>
  );
}

// ── Activity Item ──────────────────────────────────────────────────────────

function ActivityItem({ stage, propertyName, completedAt }: {
  stage: string; propertyName: string; completedAt: string;
}) {
  const s = STAGE_CONFIG[stage] ?? { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", label: stage };
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 text-xs">
          <span className="text-white font-medium truncate">{propertyName}</span>
          {" "}moved to{" "}
          <span style={{ color: s.color }} className="font-medium">{s.label}</span>
        </p>
        <p className="text-slate-600 text-xs mt-0.5">{timeAgo(completedAt)}</p>
      </div>
    </div>
  );
}

// ── Property Card ──────────────────────────────────────────────────────────

function PropertyCard({ item, onView }: { item: MyRequestItem; onView: (id: string) => void }) {
  const STAGE_ORDER = ["INITIATED", "PENDING_ACCEPTANCE", "IN_REVIEW", "VERIFICATION_ACCEPTED", "PENDING_PAYMENT", "PAYMENT_VERIFIED", "VERIFICATION_COMPLETE"];
  const currentIdx = STAGE_ORDER.indexOf(item.stage);

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 cursor-pointer"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}
      onClick={() => onView(item.id)}
      onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{item.property.name}</p>
          <p className="text-slate-500 text-xs mt-0.5 truncate">
            {[item.property.city, item.property.state].filter(Boolean).join(", ")}
          </p>
        </div>
        <StageBadge stage={item.stage} />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STAGE_ORDER.slice(0, 6).map((s, i) => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: currentIdx >= i ? "#6366f1" : "rgba(255,255,255,0.06)" }} />
        ))}
      </div>

      <p className="text-slate-600 text-xs">Updated {formatDate(item.updatedAt)}</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { isReady } = useAuthReady();
  const user = useAuthStore((s) => s.user);

  const [requests, setRequests] = useState<MyRequestItem[]>([]);
  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    Promise.all([
      getMyVerificationRequests({ page: 1, limit: 50, order: "DESC", sortBy: "createdAt" }),
      getMyTransactions(),
    ])
      .then(([reqRes, txRes]) => {
        setRequests(reqRes.data.data);
        const txData = txRes.data as { data?: unknown[] } | unknown[];
        setTransactions(Array.isArray(txData) ? txData : (txData as { data?: unknown[] })?.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isReady]);

  // ── Derived stats ──────────────────────────────────────────────────────
  const total = requests.length;
  const initiated = requests.filter((r) => r.stage === "INITIATED").length;
  const accepted = requests.filter((r) => r.stage === "VERIFICATION_ACCEPTED").length;
  const pendingPayment = requests.filter((r) => r.stage === "PENDING_PAYMENT").length;

  // ── Stage history feed — flatten all stage histories ───────────────────
  const activityFeed = requests
    .flatMap((r) =>
      (r.stageHistory ?? []).map((h) => ({
        stage: h.stage,
        propertyName: r.property.name,
        completedAt: h.completedAt,
      }))
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 8);

  const handleView = (id: string) => {
    router.push(`/dashboard/my-requests/${id}`);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#0f1117" }}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {greeting()}, {user?.firstName ?? "there"} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Here's an overview of your property verifications
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/verifyproperty")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shrink-0"
            style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Verification
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Requests" value={total} color="#818cf8" bg="rgba(99,102,241,0.08)" border="rgba(99,102,241,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>} />
          <StatCard label="Drafts" value={initiated} color="#60a5fa" bg="rgba(96,165,250,0.08)" border="rgba(96,165,250,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>} />
          <StatCard label="Accepted" value={accepted} color="#34d399" bg="rgba(52,211,153,0.08)" border="rgba(52,211,153,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} />
          <StatCard label="Pending Payment" value={pendingPayment} color="#fb923c" bg="rgba(251,146,60,0.08)" border="rgba(251,146,60,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>} />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* My Properties — takes 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold text-sm">My Properties</p>
              <button onClick={() => router.push("/dashboard/my-requests")}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View all →
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl p-4 space-y-3 animate-pulse"
                    style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl px-6 py-12 text-center"
                style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-slate-500 text-sm">No verification requests yet</p>
                <button onClick={() => router.push("/dashboard/verifyproperty")}
                  className="mt-3 text-xs text-indigo-400 underline">
                  Start your first verification
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {requests.slice(0, 6).map((item) => (
                  <PropertyCard key={item.id} item={item} onView={handleView} />
                ))}
              </div>
            )}
          </div>

          {/* Stage History Feed */}
          <div className="flex flex-col gap-3">
            <p className="text-white font-semibold text-sm">Recent Activity</p>
            <div className="rounded-2xl p-4 flex-1"
              style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 animate-pulse"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Skeleton className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-2.5 w-full" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activityFeed.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-8">No activity yet</p>
              ) : (
                <div>
                  {activityFeed.map((activity, i) => (
                    <ActivityItem
                      key={i}
                      stage={activity.stage}
                      propertyName={activity.propertyName}
                      completedAt={activity.completedAt}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex flex-col gap-3">
          <p className="text-white font-semibold text-sm">Recent Transactions</p>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>

            {/* Table header */}
            <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-widest"
              style={{ gridTemplateColumns: "1fr 1fr 120px 100px", color: "#475569", background: "#12161f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span>Reference</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid px-5 py-4 animate-pulse"
                  style={{ gridTemplateColumns: "1fr 1fr 120px 100px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-slate-500 text-sm">No transactions yet</p>
              </div>
            ) : (
              (transactions as Array<{
                id: string;
                paystackReference?: string;
                amount?: string;
                createdAt?: string;
                status?: string;
              }>).slice(0, 5).map((tx, i) => (
                <div key={tx.id ?? i} className="grid items-center px-5 py-4 transition-colors hover:bg-white/[0.02]"
                  style={{ gridTemplateColumns: "1fr 1fr 120px 100px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-slate-300 text-xs font-mono truncate">
                    {tx.paystackReference ?? "—"}
                  </span>
                  <span className="text-slate-300 text-xs">
                    {tx.amount ? `₦${Number(tx.amount).toLocaleString()}` : "—"}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {tx.createdAt ? formatDate(tx.createdAt) : "—"}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit`}
                    style={{
                      background: tx.status === "SUCCESS" ? "rgba(52,211,153,0.1)" : "rgba(245,158,11,0.1)",
                      color: tx.status === "SUCCESS" ? "#34d399" : "#f59e0b",
                      border: `1px solid ${tx.status === "SUCCESS" ? "rgba(52,211,153,0.2)" : "rgba(245,158,11,0.2)"}`,
                    }}>
                    {tx.status ?? "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}