export function OrderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 animate-pulse"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex justify-between mb-4">
            <div className="space-y-2">
              <div className="h-2.5 w-16 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-4 w-48 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <div className="h-6 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4 px-4 py-3 rounded-xl mb-4"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="space-y-1.5">
              <div className="h-2.5 w-12 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-4 w-24 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-12 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="flex flex-col items-center gap-1.5 shrink-0" style={{ minWidth: 60 }}>
                <div className="w-6 h-6 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2 w-10 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}