"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMyVerificationRequests } from "@/lib/api/verification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { MyRequestItem, MyRequestsMeta } from "@/lib/types/verification";
import {
  RequestCard,
  RequestEmptyState,
  RequestFilters,
  RequestPagination,
  RequestSkeleton,
  RequestStatsRow,
} from "@/app/components/myRequests";

const MyVerificationRequestsPage = () => {
  const router = useRouter();
  const { isReady } = useAuthReady();

  const [requests, setRequests] = useState<MyRequestItem[]>([]);
  const [meta, setMeta] = useState<MyRequestsMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  const fetchRequests = useCallback(() => {
    if (!isReady) return;
    setLoading(true);
    setError(null);

    getMyVerificationRequests({ page, limit: 9, search, order, sortBy: "createdAt" })
      .then((res) => {
        setRequests(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady, page, search, order]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    setPage(1);
  }, [search, order]);

  const handleView = (id: string) => {
    router.push(`/dashboard/my-requests/${id}`);
  };
  const handleSubmit = (id: string) => {
  router.push(`/dashboard/verifyproperty/success/${id}`);
};

  return (
    <div className="min-h-screen p-6" style={{ background: "#0f1117" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              My Verification Requests
            </h1>
            {meta && !loading && (
              <p className="text-slate-500 text-sm mt-1">
                {meta.totalItems} request{meta.totalItems !== 1 ? "s" : ""} total
              </p>
            )}
          </div>

          <button
            onClick={() => router.push("/dashboard/verifyproperty/initiate")}
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
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Request
          </button>
        </div>

        {/* Stats */}
        {!loading && requests.length > 0 && (
          <RequestStatsRow requests={requests} />
        )}

        {/* Filters */}
        <RequestFilters
          search={search}
          order={order}
          onSearchChange={setSearch}
          onOrderChange={(val) => { setOrder(val); setPage(1); }}
        />

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <RequestSkeleton />
          </div>
        ) : error ? (
          <div
            className="rounded-2xl px-6 py-16 text-center"
            style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchRequests} className="mt-3 text-xs text-slate-400 underline">
              Try again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <RequestEmptyState
            isFiltered={!!search}
            onStart={() => router.push("/dashboard/verifyproperty/initiate")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((item) => (
                <RequestCard key={item.id} item={item} onView={handleView} onSubmit={handleSubmit} />
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <RequestPagination meta={meta} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyVerificationRequestsPage;