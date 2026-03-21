import { OrderStageBadge, STAGE_CONFIG } from "./OrderStageBadge";

interface StageHistory {
  stage: string;
  completedAt: string;
}

interface PropertyVerification {
  id: string;
  stage: string;
  stageHistory: StageHistory[];
}

export interface Order {
  id: string;
  createdAt: string;
  amount: string;
  currency: string;
  status: string;
  propertyVerification: PropertyVerification;
}

interface OrderCardProps {
  order: Order;
  onView: (verificationId: string) => void;
}

const ALL_STAGES = [
  "INITIATED", "PENDING_ACCEPTANCE", "IN_REVIEW",
  "VERIFICATION_ACCEPTED", "PENDING_PAYMENT",
  "PAYMENT_VERIFIED", "VERIFICATION_COMPLETE",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function OrderCard({ order, onView }: OrderCardProps) {
  const currentStage = order.propertyVerification?.stage ?? "";
  const completedStages = new Set(order.propertyVerification?.stageHistory?.map((h) => h.stage) ?? []);
  const isRejected = currentStage === "VERIFICATION_REJECTED";

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-150"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      onClick={() => onView(order.propertyVerification?.id)}
      onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)")}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-mono">Order ID</p>
          <p className="text-white text-sm font-semibold truncate mt-0.5">{order.id}</p>
        </div>
        {currentStage && <OrderStageBadge stage={currentStage} />}
      </div>

      {/* Amount + date */}
      <div
        className="grid grid-cols-2 gap-4 px-4 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div>
          <p className="text-slate-500 text-xs">Amount</p>
          <p className="text-white text-sm font-bold mt-0.5">
            ₦{Number(order.amount).toLocaleString()}{" "}
            <span className="text-slate-500 text-xs font-normal">{order.currency}</span>
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Created</p>
          <p className="text-slate-300 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Horizontal stage pipeline */}
      {isRejected ? (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-red-400 text-xs font-medium">Verification was rejected</p>
        </div>
      ) : (
        <div className="flex items-center w-full overflow-x-auto pb-1">
          {ALL_STAGES.map((stage, i) => {
            const isCompleted = completedStages.has(stage);
            const isCurrent = stage === currentStage;
            const isLast = i === ALL_STAGES.length - 1;
            const nextCompleted = completedStages.has(ALL_STAGES[i + 1]);
            const historyEntry = order.propertyVerification?.stageHistory?.find((h) => h.stage === stage);

            return (
              <div key={stage} className="flex items-center shrink-0">
                <div className="flex flex-col items-center gap-1" style={{ minWidth: 60 }}>
                  {/* Circle */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isCompleted ? "rgba(52,211,153,0.15)" : isCurrent ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                      border: isCompleted ? "2px solid #34d399" : isCurrent ? "2px solid #818cf8" : "2px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {isCompleted ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#818cf8" }} />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className="text-center leading-tight"
                    style={{
                      fontSize: 8,
                      fontWeight: isCompleted || isCurrent ? 600 : 400,
                      color: isCompleted ? "#34d399" : isCurrent ? "#c7d2fe" : "#334155",
                      maxWidth: 52,
                    }}
                  >
                    {STAGE_CONFIG[stage]?.label ?? stage}
                  </p>

                  {/* Date */}
                  {historyEntry && (
                    <p style={{ fontSize: 7, color: "#475569" }}>
                      {new Date(historyEntry.completedAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short",
                      })}
                    </p>
                  )}
                </div>

                {/* Connector */}
                {!isLast && (
                  <div
                    className="shrink-0 transition-all duration-300"
                    style={{
                      width: 16, height: 2, borderRadius: 1, marginBottom: 24,
                      background: isCompleted && nextCompleted ? "#34d399" : isCurrent ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-600 text-right">Click to view details →</p>
    </div>
  );
}