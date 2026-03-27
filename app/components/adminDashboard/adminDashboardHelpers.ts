export const ALL_STAGES = [
  { key: "INITIATED",             label: "Initiated"          },
  { key: "PENDING_ACCEPTANCE",    label: "Pending Acceptance"  },
  { key: "IN_REVIEW",             label: "In Review"           },
  { key: "VERIFICATION_ACCEPTED", label: "Accepted"            },
  { key: "PENDING_PAYMENT",       label: "Pending Payment"     },
  { key: "PAYMENT_VERIFIED",      label: "Payment Verified"    },
  { key: "STAGE_1",               label: "Stage 1"             },
  { key: "STAGE_2",               label: "Stage 2"             },
  { key: "STAGE_3",               label: "Stage 3"             },
  { key: "VERIFICATION_COMPLETE", label: "Complete"            },
];

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function stageColor(stage: string): string {
  const map: Record<string, string> = {
    INITIATED:             "#94a3b8",
    PENDING_ACCEPTANCE:    "#fb923c",
    IN_REVIEW:             "#818cf8",
    VERIFICATION_ACCEPTED: "#34d399",
    VERIFICATION_REJECTED: "#f87171",
    PENDING_PAYMENT:       "#f59e0b",
    PAYMENT_VERIFIED:      "#34d399",
    STAGE_1:               "#60a5fa",
    STAGE_2:               "#a78bfa",
    STAGE_3:               "#f472b6",
    VERIFICATION_COMPLETE: "#34d399",
  };
  return map[stage] ?? "#94a3b8";
}

export function stageLabel(stage: string): string {
  const map: Record<string, string> = {
    INITIATED:             "Initiated",
    PENDING_ACCEPTANCE:    "Pending Acceptance",
    IN_REVIEW:             "In Review",
    VERIFICATION_ACCEPTED: "Accepted",
    VERIFICATION_REJECTED: "Rejected",
    PENDING_PAYMENT:       "Pending Payment",
    PAYMENT_VERIFIED:      "Payment Verified",
    STAGE_1:               "Stage 1",
    STAGE_2:               "Stage 2",
    STAGE_3:               "Stage 3",
    VERIFICATION_COMPLETE: "Complete",
  };
  return map[stage] ?? stage;
}