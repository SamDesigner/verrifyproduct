interface AdminStatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  loading: boolean;
}

export function AdminStatCard({ label, value, color, bg, border, icon, loading }: AdminStatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-row items-stretch overflow-hidden"
    //   style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}

    >
      {/* Left accent bar */}
      <div className="w-1 rounded-full shrink-0 mr-4" style={{ background: color, opacity: 0.7 }} />

      {/* Content */}
      <div className="flex flex-col justify-between gap-3 flex-1">
        {/* Icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: bg, border: `1px solid ${border}`, color }}
        >
          {icon}
        </div>

        {/* Label + Value */}
        <div className="flex flex-col gap-0.5">
          <p className="text-slate-500 text-xs font-medium leading-none">{label}</p>
          {loading ? (
            <div className="h-7 w-10 mt-1 rounded-md animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          ) : (
            <p className="text-2xl font-bold leading-tight" style={{ color }}>{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}