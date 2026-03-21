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
      className="rounded-2xl p-5 flex items-center justify-between gap-4"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div>
        <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        )}
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg, border: `1px solid ${border}`, color }}
      >
        {icon}
      </div>
    </div>
  );
}