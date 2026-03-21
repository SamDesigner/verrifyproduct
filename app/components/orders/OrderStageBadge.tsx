const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  INITIATED:             { label: "Initiated",          color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"  },
  PENDING_ACCEPTANCE:    { label: "Pending Acceptance", color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
  IN_REVIEW:             { label: "In Review",          color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  VERIFICATION_ACCEPTED: { label: "Accepted",           color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  VERIFICATION_REJECTED: { label: "Rejected",           color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  PENDING_PAYMENT:       { label: "Pending Payment",    color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)"  },
  PAYMENT_VERIFIED:      { label: "Payment Verified",   color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  VERIFICATION_COMPLETE: { label: "Complete",           color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
};

export function OrderStageBadge({ stage }: { stage: string }) {
  const s = STAGE_CONFIG[stage] ?? {
    label: stage, color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)",
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

export { STAGE_CONFIG };