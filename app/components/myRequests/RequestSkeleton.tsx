export function RequestSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 animate-pulse"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-2/3 rounded-lg" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
            <div className="h-6 w-24 rounded-full ml-3" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-3 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
          <div className="h-1.5 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-9 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      ))}
    </>
  );
}