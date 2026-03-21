export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export const ALL_STAGES = [
  { key: "INITIATED", label: "Initiated" },
  { key: "PENDING_ACCEPTANCE", label: "Pending Acceptance" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "VERIFICATION_ACCEPTED", label: "Accepted" },
  { key: "PENDING_PAYMENT", label: "Pending Payment" },
  { key: "PAYMENT_VERIFIED", label: "Payment Verified" },
  { key: "STAGE_1", label: "Stage 1" },
  { key: "STAGE_2", label: "Stage 2" },
  { key: "STAGE_3", label: "Stage 3" },
  { key: "VERIFICATION_COMPLETE", label: "Complete" },
];

export const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  INITIATED: { label: "Initiated", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
  PENDING_ACCEPTANCE: { label: "Pending Acceptance", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  IN_REVIEW: { label: "In Review", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  VERIFICATION_ACCEPTED: { label: "Accepted", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  VERIFICATION_REJECTED: { label: "Rejected", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  PENDING_PAYMENT: { label: "Pending Payment", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
  PAYMENT_VERIFIED: { label: "Payment Verified", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  VERIFICATION_COMPLETE: { label: "Complete", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
};

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}