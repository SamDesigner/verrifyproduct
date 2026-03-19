"use client";

interface VerificationFiltersProps {
  search: string;
  order: "ASC" | "DESC";
  onSearchChange: (value: string) => void;
  onOrderChange: (value: "ASC" | "DESC") => void;
}

export function VerificationFilters({
  search,
  order,
  onSearchChange,
  onOrderChange,
}: VerificationFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">

      {/* Search */}
      <div
        className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2.5 rounded-xl transition-all duration-150"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by property, owner..."
          className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none"
        />
        {search && (
          <button onClick={() => onSearchChange("")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Order toggle */}
      <div
        className="flex items-center rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {(["ASC", "DESC"] as const).map((o) => (
          <button
            key={o}
            onClick={() => onOrderChange(o)}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all duration-150"
            style={{
              background: order === o ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
              color: order === o ? "#818cf8" : "#475569",
              borderRight: o === "ASC" ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            {o === "ASC" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l4-4 4 4M7 4v16M13 16l4 4 4-4M17 20V4" />
                </svg>
                Oldest
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 16l4 4 4-4M7 20V4M13 8l4-4 4 4M17 4v16" />
                </svg>  
                Newest
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}