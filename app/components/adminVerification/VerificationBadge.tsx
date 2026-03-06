const STAGE_STYLES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  PENDING_ACCEPTANCE: { label: "Pending Acceptance", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  INITIATED:          { label: "Initiated",          color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  dot: "#60a5fa" },
  VERIFIED:           { label: "Verified",           color: "#34d399", bg: "rgba(52,211,153,0.12)",  dot: "#34d399" },
  REJECTED:           { label: "Rejected",           color: "#f87171", bg: "rgba(248,113,113,0.12)", dot: "#f87171" },
  PENDING:            { label: "Pending",            color: "#a78bfa", bg: "rgba(167,139,250,0.12)", dot: "#a78bfa" },
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