export function OrderEmptyState() {
  return (
    <div
      className="rounded-2xl px-6 py-16 text-center"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm">No orders yet</p>
      <p className="text-slate-600 text-xs mt-1">
        Orders will appear here once your verification is accepted
      </p>
    </div>
  );
}