import { Skeleton } from "./DashboardHelpers";

interface DashboardStatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  loading: boolean;
}

export function DashboardStatCard({
  label, value, color, bg, border, icon, loading,
}: DashboardStatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-row items-stretch gap-0 overflow-hidden relative"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Left accent bar */}
      <div
        className="w-1 rounded-full shrink-0 mr-4"
        style={{ background: color, opacity: 0.7 }}
      />

      {/* Content */}
      <div className="flex flex-col justify-between gap-3 flex-1">
        
        {/* Icon — small, top */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: bg, border: `1px solid ${border}`, color }}
        >
          {/* Clone icon at smaller size */}
          <span style={{ color, display: "flex", alignItems: "center" }}>
            {icon}
          </span>
        </div>

        {/* Label + Value stacked */}
        <div className="flex flex-col gap-0.5">
          <p className="text-slate-500 text-xs font-medium leading-none">{label}</p>
          {loading ? (
            <Skeleton className="h-7 w-10 mt-1" />
          ) : (
            <p className="text-2xl font-bold leading-tight" style={{ color }}>{value}</p>
          )}
        </div>

      </div>
    </div>
  );
}