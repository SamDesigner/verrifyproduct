"use client";
import { useState } from "react";

interface AdvanceStageModalProps {
  isOpen: boolean;
  currentStage: string;
  nextStage: string;
  onClose: () => void;
  onSubmit: (adminComments: string, verificationFiles: string[]) => Promise<void>;
}

const STAGE_LABELS: Record<string, string> = {
  PENDING_PAYMENT:       "Pending Payment",
  PAYMENT_VERIFIED:      "Payment Verified",
  STAGE_1:               "Stage 1",
  STAGE_2:               "Stage 2",
  STAGE_3:               "Stage 3",
  VERIFICATION_COMPLETE: "Verification Complete",
};

export function AdvanceStageModal({
  isOpen,
  currentStage,
  nextStage,
  onClose,
  onSubmit,
}: AdvanceStageModalProps) {
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(comments, []);
      setComments("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setComments("");
    setError(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
        <div
          className="w-full max-w-md rounded-2xl p-6 space-y-5"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Advance Stage</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Move from{" "}
                <span className="text-indigo-400 font-medium">
                  {STAGE_LABELS[currentStage] ?? currentStage}
                </span>{" "}
                to{" "}
                <span className="text-green-400 font-medium">
                  {STAGE_LABELS[nextStage] ?? nextStage}
                </span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stage arrow */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
          >
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
            >
              {STAGE_LABELS[currentStage] ?? currentStage}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
            >
              {STAGE_LABELS[nextStage] ?? nextStage}
            </span>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Admin Comments <span className="text-slate-600 normal-case">(optional)</span>
            </p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Add any notes about this stage advancement..."
              className="w-full resize-none rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                background: loading ? "rgba(52,211,153,0.08)" : "rgba(52,211,153,0.15)",
                color: loading ? "#059669" : "#34d399",
                border: "1px solid rgba(52,211,153,0.3)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "rgba(52,211,153,0.25)")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "rgba(52,211,153,0.15)")}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Advancing...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Advance Stage
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}