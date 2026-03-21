import { STAGE_CONFIG } from "./DashboardHelpers";

interface DashboardStageBadgeProps {
  stage: string;
}

export function DashboardStageBadge({ stage }: DashboardStageBadgeProps) {
  const s = STAGE_CONFIG[stage] ?? {
    label: stage, color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)",
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}