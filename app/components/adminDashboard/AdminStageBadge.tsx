const stageConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  INITIATED:               { label: "Initiated",          color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
  PENDING_ACCEPTANCE:      { label: "Pending Acceptance",  color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)"  },
  IN_REVIEW:               { label: "In Review",           color: "#818cf8", bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.2)"  },
  VERIFICATION_ACCEPTED:   { label: "Accepted",            color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  VERIFICATION_REJECTED:   { label: "Rejected",            color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  PENDING_PAYMENT:         { label: "Pending Payment",     color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
  PAYMENT_VERIFIED:        { label: "Payment Verified",    color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  STAGE_1:                 { label: "Stage 1",             color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"  },
  STAGE_2:                 { label: "Stage 2",             color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  STAGE_3:                 { label: "Stage 3",             color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.2)" },
  VERIFICATION_COMPLETE:   { label: "Complete",            color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
};

export function AdminStageBadge({ stage }: { stage: string }) {
  const cfg = stageConfig[stage] ?? { label: stage, color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" };
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0 whitespace-nowrap flex items-center gap-1.5"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}