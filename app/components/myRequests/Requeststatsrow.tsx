import { MyRequestItem } from "@/lib/types/verification";

interface RequestStatsRowProps {
  requests: MyRequestItem[];
}

export function RequestStatsRow({ requests }: RequestStatsRowProps) {
  const stats = [
    {
      label: "Draft",
      count: requests.filter((r) => r.stage === "INITIATED").length,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.08)",
      border: "rgba(96,165,250,0.15)",
    },
    {
      label: "Pending Review",
      count: requests.filter((r) => r.stage === "PENDING_ACCEPTANCE").length,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.15)",
    },
    {
      label: "In Review",
      count: requests.filter((r) => r.stage === "IN_REVIEW").length,
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.15)",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, count, color, bg, border }) => (
        <div
          key={label}
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ background: bg, border: `1px solid ${border}` }}
        >
          <p className="text-xs font-medium" style={{ color }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color }}>{count}</p>
        </div>
      ))}
    </div>
  );
}