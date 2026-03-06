interface DetailCardProps {
  title: string;
  children: React.ReactNode;
}

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value?: string | number | null | boolean;
}

export function DetailRow({ label, value }: DetailRowProps) {
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : value ?? "—";
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500 text-xs shrink-0">{label}</span>
      <span className="text-slate-300 text-xs font-medium text-right break-all">
        {String(display)}
      </span>
    </div>
  );
}