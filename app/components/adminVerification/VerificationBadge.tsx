const STAGE_STYLES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  INITIATED:               { label: "Initiated",               color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  dot: "#60a5fa" },
  PENDING_ACCEPTANCE:      { label: "Pending Acceptance",      color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  dot: "#f59e0b" },
  IN_REVIEW:               { label: "In Review",               color: "#a78bfa", bg: "rgba(167,139,250,0.12)", dot: "#a78bfa" },
  VERIFICATION_ACCEPTED:   { label: "Verification Accepted",   color: "#34d399", bg: "rgba(52,211,153,0.12)",  dot: "#34d399" },
  VERIFICATION_REJECTED:   { label: "Verification Rejected",   color: "#f87171", bg: "rgba(248,113,113,0.12)", dot: "#f87171" },
  PENDING_PAYMENT:         { label: "Pending Payment",         color: "#fb923c", bg: "rgba(251,146,60,0.12)",  dot: "#fb923c" },
  PAYMENT_VERIFIED:        { label: "Payment Verified",        color: "#34d399", bg: "rgba(52,211,153,0.12)",  dot: "#34d399" },
  STAGE_1:                 { label: "Stage 1",                 color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  dot: "#60a5fa" },
  STAGE_2:                 { label: "Stage 2",                 color: "#818cf8", bg: "rgba(129,140,248,0.12)", dot: "#818cf8" },
  STAGE_3:                 { label: "Stage 3",                 color: "#a78bfa", bg: "rgba(167,139,250,0.12)", dot: "#a78bfa" },
  VERIFICATION_COMPLETE:   { label: "Verification Complete",   color: "#34d399", bg: "rgba(52,211,153,0.12)",  dot: "#34d399" },
};
interface VerificationBadgeProps {
  stage: string;
}

export function VerificationBadge({ stage }: VerificationBadgeProps) {
  const s = STAGE_STYLES[stage] ?? {
    label: stage,
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    dot: "#94a3b8",
  };

  return (
    <span
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap"
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {s.label}
    </span>
  );
}