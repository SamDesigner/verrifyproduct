interface VerificationSectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function VerificationSectionCard({ title, icon, children }: VerificationSectionCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="flex items-center gap-2.5 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}
        >
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}