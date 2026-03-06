import { VerificationItem, VerificationMeta } from "@/lib/types/verification";
import { VerificationRow } from "./VerificationRow";
import { VerificationSkeleton } from "./VerificationSkeleton";
import { VerificationPagination } from "./VerificationPagination";

interface VerificationTableProps {
  verifications: VerificationItem[];
  meta: VerificationMeta | null;
  loading: boolean;
  error: string | null;
  onView: (id: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export function VerificationTable({
  verifications,
  meta,
  loading,
  error,
  onView,
  onPageChange,
  onRetry,
}: VerificationTableProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Column headers */}
      <div
        className="px-6 py-3 grid items-center gap-4 text-xs font-semibold uppercase tracking-widest"
        style={{
          gridTemplateColumns: "1fr 1fr 160px 120px 36px",
          color: "#475569",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#12161f",
        }}
      >
        <span>Property</span>
        <span>Owner</span>
        <span>Stage</span>
        <span>Created</span>
        <span />
      </div>

      {/* Content */}
      {loading ? (
        <VerificationSkeleton />
      ) : error ? (
        <div className="px-6 py-16 text-center">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={onRetry} className="mt-3 text-xs text-slate-400 underline">
            Try again
          </button>
        </div>
      ) : verifications.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-slate-500 text-sm">No verification requests found.</p>
        </div>
      ) : (
        verifications.map((item) => (
          <VerificationRow key={item.id} item={item} onView={onView} />
        ))
      )}

      {/* Pagination */}
      {meta && !loading && meta.totalPages > 1 && (
        <VerificationPagination meta={meta} onPageChange={onPageChange} />
      )}
    </div>
  );
}