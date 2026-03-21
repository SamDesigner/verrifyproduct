"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyVerificationRequests } from "@/lib/api/verification";
import { getMyTransactions } from "@/lib/api/payment";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import { MyRequestItem } from "@/lib/types/verification";
import {
  DashboardStatCard,
  DashboardStagePipeline,
  DashboardActivityFeed,
  DashboardTransactions,
} from "@/app/components/dashboard";
import type { Transaction } from "@/app/components/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { isReady } = useAuthReady();
  const user = useAuthStore((s) => s.user);

  const [requests, setRequests] = useState<MyRequestItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    Promise.all([
      getMyVerificationRequests({ page: 1, limit: 50, order: "DESC", sortBy: "createdAt" }),
      getMyTransactions(),
    ])
      .then(([reqRes, txRes]) => {
        setRequests(reqRes.data.data);
        const txData = txRes.data as { data?: Transaction[] } | Transaction[];
        setTransactions(Array.isArray(txData) ? txData : (txData as { data?: Transaction[] })?.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isReady]);

  // ── Derived stats ──────────────────────────────────────────────────────
  const total = requests.length;
  const initiated = requests.filter((r) => r.stage === "INITIATED").length;
  const accepted = requests.filter((r) => r.stage === "VERIFICATION_ACCEPTED").length;
  const pendingPayment = requests.filter((r) => r.stage === "PENDING_PAYMENT").length;

  // ── Activity feed ──────────────────────────────────────────────────────
  const activityFeed = requests
    .flatMap((r) => (r.stageHistory ?? []).map((h) => ({
      stage: h.stage,
      propertyName: r.property.name,
      completedAt: h.completedAt,
    })))
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 8);

  const handleView = (id: string) => {
    if (id === "all") { router.push("/dashboard/my-requests"); return; }
    router.push(`/dashboard/my-requests/${id}`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
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
              Here&apos;s an overview of your property verifications
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DashboardStatCard label="Total Requests" value={total} color="#818cf8" bg="rgba(99,102,241,0.08)" border="rgba(99,102,241,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>} />
          <DashboardStatCard label="Drafts" value={initiated} color="#60a5fa" bg="rgba(96,165,250,0.08)" border="rgba(96,165,250,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>} />
          <DashboardStatCard label="Accepted" value={accepted} color="#34d399" bg="rgba(52,211,153,0.08)" border="rgba(52,211,153,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} />
          <DashboardStatCard label="Pending Payment" value={pendingPayment} color="#fb923c" bg="rgba(251,146,60,0.08)" border="rgba(251,146,60,0.2)" loading={loading}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>} />
        </div>

        {/* Stage History Pipelines */}
        <DashboardStagePipeline
          requests={requests}
          loading={loading}
          onView={handleView}
          onStartNew={() => router.push("/dashboard/verifyproperty")}
        />

        {/* Activity + Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DashboardActivityFeed feed={activityFeed} loading={loading} />
          <DashboardTransactions transactions={transactions} loading={loading} />
        </div>

      </div>
    </div>
  );
}