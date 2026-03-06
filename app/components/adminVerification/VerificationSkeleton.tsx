export function VerificationSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 grid items-center gap-4 animate-pulse"
          style={{
            gridTemplateColumns: "1fr 1fr 160px 120px 36px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="space-y-2">
            <div className="h-3 rounded w-3/4" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-2.5 rounded w-1/2" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded w-2/3" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-2.5 rounded w-1/2" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="h-6 rounded-full w-32" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-2.5 rounded w-20" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="h-4 w-4 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      ))}
    </>
  );
}