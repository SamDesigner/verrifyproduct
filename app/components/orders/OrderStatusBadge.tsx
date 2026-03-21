export function OrderStatusBadge({ status }: { status: string }) {
  const isSuccess = status === "SUCCESS";
  const isPending = status === "PENDING";
  const color = isSuccess ? "#34d399" : isPending ? "#f59e0b" : "#f87171";
  const bg = isSuccess ? "rgba(52,211,153,0.1)" : isPending ? "rgba(245,158,11,0.1)" : "rgba(248,113,113,0.1)";
  const border = isSuccess ? "rgba(52,211,153,0.2)" : isPending ? "rgba(245,158,11,0.2)" : "rgba(248,113,113,0.2)";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}