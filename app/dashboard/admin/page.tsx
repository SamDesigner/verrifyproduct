"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVerificationList } from "@/lib/api/adminVerification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import { VerificationItem } from "@/lib/types/verification";
import {
  AdminStatCard,
  AdminVerificationPipeline,
  AdminActivityFeed,
  AdminTransactionsList,
  AdminPendingVerdicts,
} from "@/app/components/adminDashboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isReady } = useAuthReady();
  const user = useAuthStore((s) => s.user);

  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    getVerificationList({ page: 1, limit: 50, order: "DESC" })
      .then((res) => setVerifications(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isReady]);

  // ── Derived stats ──────────────────────────────────────────────────────
  const totalVerifications = verifications.length;
  const pendingReview = verifications.filter((v) =>
    ["PENDING_ACCEPTANCE", "IN_REVIEW"].includes(v.stage)
  ).length;
  const accepted = verifications.filter((v) => v.stage === "VERIFICATION_ACCEPTED").length;
  const rejected = verifications.filter((v) => v.stage === "VERIFICATION_REJECTED").length;
  const pendingPayment = verifications.filter((v) => v.stage === "PENDING_PAYMENT").length;

  // Unique users
  const totalUsers = new Set(verifications.map((v) => v.user)).size;

  // ── Activity feed ──────────────────────────────────────────────────────
  const activityFeed = verifications
    .flatMap((v) =>
      (v.stageHistory ?? []).map((h) => ({
        stage: h.stage,
        propertyName: v.property.name,
        completedAt: h.completedAt,
      }))
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 8);

  // ── Pending verdicts ───────────────────────────────────────────────────
  const pendingVerdicts = verifications
    .filter((v) => v.stage === "IN_REVIEW")
    .slice(0, 5);

  // ── Recent transactions (PENDING_PAYMENT + PAYMENT_VERIFIED) ──────────
  const recentTransactions = verifications
    .filter((v) => ["PENDING_PAYMENT", "PAYMENT_VERIFIED"].includes(v.stage))
    .slice(0, 8);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    // style={{ background: "#0f1117" }}
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {greeting()}, {user?.firstName ?? "Admin"} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Here&apos;s an overview of all property verifications
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/admin/verification-request")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shrink-0"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            View All Requests
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AdminStatCard
            label="Total Verifications"
            value={totalVerifications}
            color="#818cf8"
            bg="rgba(99,102,241,0.08)"
            border="rgba(99,102,241,0.2)"
            loading={loading}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>}
          />
          <AdminStatCard
            label="Pending Review"
            value={pendingReview}
            color="#fb923c"
            bg="rgba(251,146,60,0.08)"
            border="rgba(251,146,60,0.2)"
            loading={loading}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          />
          <AdminStatCard
            label="Accepted"
            value={accepted}
            color="#34d399"
            bg="rgba(52,211,153,0.08)"
            border="rgba(52,211,153,0.2)"
            loading={loading}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
          />
          <AdminStatCard
            label="Rejected"
            value={rejected}
            color="#f87171"
            bg="rgba(248,113,113,0.08)"
            border="rgba(248,113,113,0.2)"
            loading={loading}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
          />
          <AdminStatCard
            label="Unique Users"
            value={totalUsers}
            color="#60a5fa"
            bg="rgba(96,165,250,0.08)"
            border="rgba(96,165,250,0.2)"
            loading={loading}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>}
          />
          <AdminStatCard
            label="Pending Payment"
            value={pendingPayment}
            color="#f59e0b"
            bg="rgba(245,158,11,0.08)"
            border="rgba(245,158,11,0.2)"
            loading={loading}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>}
          />
        </div>

        {/* Verification Pipeline */}
        <AdminVerificationPipeline
          verifications={verifications}
          loading={loading}
          onView={(id) => router.push(`/dashboard/admin/verification-request/${id}`)}
          onViewAll={() => router.push("/dashboard/admin/verification-request")}
        />

        {/* Pending Verdicts + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminPendingVerdicts
            items={pendingVerdicts}
            loading={loading}
            onView={(id:string) => router.push(`/dashboard/admin/verification-request/${id}`)}
          />
          <AdminActivityFeed feed={activityFeed} loading={loading} />
        </div>

        {/* Recent Transactions */}
        <AdminTransactionsList items={recentTransactions} loading={loading} />

      </div>
    </div>
  );
}