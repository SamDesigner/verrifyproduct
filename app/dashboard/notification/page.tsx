// app/dashboard/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyVerificationRequests } from "@/lib/api/verification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { DashboardActivityFeed } from "@/app/components/dashboard";
import { MyRequestItem } from "@/lib/types/verification";

export default function NotificationsPage() {
  const { isReady } = useAuthReady();
  const [requests, setRequests] = useState<MyRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    getMyVerificationRequests({ page: 1, limit: 50, order: "DESC", sortBy: "createdAt" })
      .then((res) => setRequests(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isReady]);

  // Derive activity feed from requests — same logic as dashboard
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

  return (
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Recent activity across your property verifications
          </p>
        </div>

        {/* Activity Feed */}
        <DashboardActivityFeed feed={activityFeed} loading={loading} />

      </div>
    </div>
  );
}