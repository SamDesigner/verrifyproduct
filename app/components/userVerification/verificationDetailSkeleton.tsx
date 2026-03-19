export function VerificationDetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="h-8 w-8 rounded-lg shrink-0"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <div className="space-y-2">
          <div className="h-4 w-48 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: "#161b27",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="h-3 w-24 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex justify-between gap-4">
                <div className="h-2.5 w-20 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-2.5 w-24 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Documents skeleton */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="h-3 w-24 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4 py-1">
            <div className="h-2.5 w-40 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-2.5 w-12 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}