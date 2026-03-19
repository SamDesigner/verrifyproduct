"use client";
import { useState } from "react";
import { VerdictType } from "@/lib/types/verification";

interface VerdictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (verdict: VerdictType, comments: string) => Promise<void>;
}

export function VerdictModal({ isOpen, onClose, onSubmit }: VerdictModalProps) {
  const [verdict, setVerdict] = useState<VerdictType | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!verdict) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(verdict, comments);
      setVerdict(null);
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
    setVerdict(null);
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 space-y-5"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Submit Verdict</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                This action will finalize the verification decision
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

          {/* Verdict selector */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Verdict</p>
            <div className="grid grid-cols-2 gap-3">
             {(["ACCEPTED", "REJECTED"] as VerdictType[]).map((v) => {
                const isSelected = verdict === v;
                const isAccepted = v === "ACCEPTED";
                const selectedColor = isAccepted ? "#34d399" : "#f87171";
                const selectedBg = isAccepted ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)";
                const selectedBorder = isAccepted ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)";

                return (
                  <button
                    key={v}
                    onClick={() => setVerdict(v)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
                    style={{
                      background: isSelected ? selectedBg : "rgba(255,255,255,0.03)",
                      color: isSelected ? selectedColor : "#64748b",
                      border: `1px solid ${isSelected ? selectedBorder : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    {isAccepted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    )}
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Comments</p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="Add comments about this decision..."
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
              disabled={!verdict || loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                background: !verdict || loading ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.2)",
                color: !verdict || loading ? "#4338ca" : "#818cf8",
                border: `1px solid ${!verdict || loading ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.4)"}`,
                cursor: !verdict || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Submitting...
                </>
              ) : "Submit Verdict"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}