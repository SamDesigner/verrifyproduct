import { useState } from "react";
import { VerificationItem } from "@/lib/types/verification";
import { VerificationBadge } from "./VerificationBadge";

interface VerificationRowProps {
  item: VerificationItem;
  onView: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className="text-slate-300 text-xs font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s ease",
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerificationRow({ item, onView }: VerificationRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      className="transition-colors duration-150 hover:bg-white/2"
    >
      {/* Collapsed row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 grid items-center gap-4"
        style={{ gridTemplateColumns: "1fr 1fr 160px 120px 36px" }}
      >
        {/* Property */}
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            {item.property?.name ?? "—"}
          </p>
          <p className="text-slate-400 text-xs truncate mt-0.5">
            {[item.property?.address, item.property?.city, item.property?.state]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        {/* Owner */}
        <div className="min-w-0">
          <p className="text-slate-200 text-sm font-medium truncate">
            {item.user ? `${item.user.firstName} ${item.user.lastName}` : "—"}
          </p>
          <p className="text-slate-400 text-xs truncate mt-0.5">
            {item.user?.email ?? "—"}
          </p>
        </div>

        {/* Stage */}
        <div>
          <VerificationBadge stage={item.stage} />
        </div>

        {/* Date */}
        <p className="text-slate-400 text-xs">{formatDate(item.createdAt)}</p>

        {/* Chevron */}
        <Chevron open={open} />
      </button>

      {/* Expanded panel */}
      <div
        style={{
          maxHeight: open ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div
          className="px-6 pb-5 pt-3 grid grid-cols-2 gap-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Property details */}
          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
              Property Details
            </p>
            <DetailRow label="Property Type" value={item.property?.propertyType} />
            <DetailRow label="Verification Status" value={item.property?.propertyVerificationStatus} />
            <DetailRow label="Sub-property" value={item.property?.isSubProperty ? "Yes" : "No"} />
            <DetailRow label="Last Updated" value={formatDate(item.updatedAt)} />
            {item.caseId && <DetailRow label="Case ID" value={item.caseId} />}
          </div>

          {/* Stage history + action */}
          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
              Stage History
            </p>
            {item.stageHistory?.length > 0 ? (
              <div className="space-y-2">
                {(item.stageHistory as Array<{ stage: string; createdAt: string }>)
                  .slice(0, 3)
                  .map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                      <span className="text-slate-300 text-xs">{h.stage}</span>
                      {h.createdAt && (
                        <span className="text-slate-500 text-xs ml-auto">
                          {formatDate(h.createdAt)}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs">No history available</p>
            )}

            <button
              onClick={() => onView(item.id)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                background: "rgba(99,102,241,0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View Full Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}