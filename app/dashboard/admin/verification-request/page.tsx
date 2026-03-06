"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVerificationList } from "@/lib/api/adminVerification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { VerificationItem, VerificationMeta } from "@/lib/types/verification";
import { VerificationTable } from "@/app/components/adminVerification/VerificationTable";

const VerificationRequestsPage = () => {
  const router = useRouter();
  const { isReady } = useAuthReady();

  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [meta, setMeta] = useState<VerificationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerifications = (currentPage: number) => {
    setLoading(true);
    setError(null);

    getVerificationList({ page: currentPage, limit: 10 })
      .then((res) => {
        setVerifications(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isReady) return;
    fetchVerifications(page);
  }, [isReady, page]);

  const handleView = (id: string) => {
    router.push(`/dashboard/admin/verification-request/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRetry = () => {
    fetchVerifications(page);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#0f1117" }}>
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