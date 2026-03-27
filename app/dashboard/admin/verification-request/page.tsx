"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getVerificationList } from "@/lib/api/adminVerification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { VerificationItem, VerificationMeta } from "@/lib/types/verification";
import { VerificationTable } from "@/app/components/adminVerification/VerificationTable";
import { VerificationFilters } from "@/app/components/adminVerification/VerificationFilters";

const VerificationRequestsPage = () => {
  const router = useRouter();
  const { isReady } = useAuthReady();

  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [meta, setMeta] = useState<VerificationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerifications = useCallback(() => {
    if (!isReady) return;
    setLoading(true);
    setError(null);

    getVerificationList({ page, limit: 10, search, order })
      .then((res) => {
        setVerifications(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady, page, search, order]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // Reset to page 1 when search or order changes
  useEffect(() => {
    setPage(1);
  }, [search, order]);

  const handleView = (id: string) => {
    router.push(`/dashboard/admin/verification-request/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRetry = () => {
    fetchVerifications();
  };

  return (

    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Verification Requests
        </h1>
        {meta && !loading && (
          <p className="text-slate-400 text-sm mt-1">
            {meta.totalItems} request{meta.totalItems !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <VerificationFilters
          search={search}
          order={order}
          onSearchChange={setSearch}
          onOrderChange={(val) => { setOrder(val); setPage(1); }}
        />
      </div>

      {/* Table */}
      <VerificationTable
        verifications={verifications}
        meta={meta}
        loading={loading}
        error={error}
        onView={handleView}
        onPageChange={handlePageChange}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default VerificationRequestsPage;