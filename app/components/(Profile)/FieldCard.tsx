function FieldCard({ label, value, icon }: { label: string; value?: string | null; icon: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2 transition-all duration-150 group"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "#475569" }}>{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
          {label}
        </p>
      </div>
      <p className="text-sm font-medium" style={{ color: value ? "#e2e8f0" : "#334155" }}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default FieldCard