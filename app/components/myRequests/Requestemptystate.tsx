interface RequestEmptyStateProps {
  onStart: () => void;
  isFiltered?: boolean;
}

export function RequestEmptyState({ onStart, isFiltered }: RequestEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-white font-semibold">
          {isFiltered ? "No results found" : "No verification requests yet"}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {isFiltered
            ? "Try adjusting your search or filters"
            : "Start by initiating a property verification"}
        </p>
      </div>

      {!isFiltered && (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{
            background: "rgba(99,102,241,0.15)",
            color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Initiate Verification
        </button>
      )}
    </div>
  );
}