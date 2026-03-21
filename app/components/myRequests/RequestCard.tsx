"use client";
import { MyRequestItem } from "@/lib/types/verification";
import { RequestStageBadge } from "./Requeststagebadge";




import { useState } from "react";


import { initializeVerificationPayment, getVerificationOrder } from "@/lib/api/payment";
import { toastError, toastSuccess } from "@/lib/toast/toast";

interface RequestCardProps {
  item: MyRequestItem;
  onView: (id: string) => void;
  onSubmit: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-xs shrink-0">{icon}</span>
      <span className="text-slate-600 text-xs shrink-0">{label}:</span>
      <span className="text-slate-400 text-xs truncate">{value}</span>
    </div>
  );
}

const STAGE_ORDER = [
  "INITIATED", "PENDING_ACCEPTANCE", "IN_REVIEW",
  "VERIFICATION_ACCEPTED", "VERIFICATION_REJECTED",
  "PENDING_PAYMENT", "PAYMENT_VERIFIED", "VERIFICATION_COMPLETE",
];

export function RequestCard({ item, onView, onSubmit }: RequestCardProps) {
  const [paying, setPaying] = useState(false);

  const docs = [
    item.property.certificationOfOccupancy,
    item.property.contractOfSale,
    item.property.surveyPlan,
    item.property.letterOfIntent,
    item.property.deedOfConveyance,
  ].filter(Boolean).length;

  const canSubmit = item.stage === "INITIATED";
  const canPay = item.stage === "VERIFICATION_ACCEPTED";
  const canContinuePay = item.stage === "PENDING_PAYMENT";
  const currentStageIdx = STAGE_ORDER.indexOf(item.stage);
  const progressSteps = STAGE_ORDER.slice(0, 4);

  // ── Initialize payment with Paystack popup ─────────────────────────────
  const handleInitializePayment = async () => {
    setPaying(true);
    try {
      const res = await initializeVerificationPayment(item.id);
      const accessCode = res.data?.paystackDetails?.access_code;

      if (!accessCode) {
        toastError("Could not retrieve payment details.");
        return;
      }

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: async () => {
          toastSuccess("Payment successful!");
          onView(item.id); // Navigate to detail page to see updated stage
        },
        onCancel: () => {
          toastError("Payment cancelled.");
        },
      });
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Payment initialization failed");
    } finally {
      setPaying(false);
    }
  };

  // ── Continue payment ───────────────────────────────────────────────────
  const handleContinuePayment = async () => {
    setPaying(true);
    try {
      const res = await getVerificationOrder(item.id);
      const data = res.data as { transactions?: { paystackReference?: string }[] };
      const reference = data?.transactions?.[0]?.paystackReference;

      if (!reference) {
        toastError("Payment reference not found. Please contact support.");
        return;
      }

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();
      popup.resumeTransaction(reference, {
        onSuccess: async () => {
          toastSuccess("Payment successful!");
          onView(item.id);
        },
        onCancel: () => {
          toastError("Payment cancelled.");
        },
      });
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to continue payment");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{item.property.name}</h3>
          <p className="text-slate-500 text-xs mt-0.5 truncate">
            {[item.property.address, item.property.city, item.property.state].filter(Boolean).join(", ")}
          </p>
        </div>
        <RequestStageBadge stage={item.stage} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-3 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <MetaItem icon="🏷️" label="Type" value={item.property.propertyType} />
        <MetaItem icon="📅" label="Created" value={formatDate(item.createdAt)} />
        <MetaItem icon="📄" label="Docs" value={`${docs} uploaded`} />
        <MetaItem icon="✅" label="Status" value={item.property.propertyVerificationStatus.replace(/_/g, " ")} />
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {progressSteps.map((s) => {
          const stepIdx = STAGE_ORDER.indexOf(s);
          const isPast = currentStageIdx >= stepIdx;
          return (
            <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: isPast ? "#6366f1" : "rgba(255,255,255,0.06)" }} />
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* View Details */}
        <button onClick={() => onView(item.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
          style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          View Details
        </button>

        {/* Submit */}
        {canSubmit && (
          <button onClick={() => onSubmit(item.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.1)")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
            Submit
          </button>
        )}

        {/* Pay Now */}
        {canPay && (
          <button onClick={handleInitializePayment} disabled={paying}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{
              background: paying ? "rgba(52,211,153,0.08)" : "rgba(52,211,153,0.12)",
              color: paying ? "#059669" : "#34d399",
              border: "1px solid rgba(52,211,153,0.25)",
              cursor: paying ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => !paying && (e.currentTarget.style.background = "rgba(52,211,153,0.22)")}
            onMouseLeave={(e) => !paying && (e.currentTarget.style.background = "rgba(52,211,153,0.12)")}
          >
            {paying ? (
              <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>Processing...</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>Pay Now</>
            )}
          </button>
        )}

        {/* Continue Payment */}
        {canContinuePay && (
          <button onClick={handleContinuePayment} disabled={paying}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
            style={{
              background: paying ? "rgba(251,146,60,0.08)" : "rgba(251,146,60,0.12)",
              color: paying ? "#c2410c" : "#fb923c",
              border: "1px solid rgba(251,146,60,0.25)",
              cursor: paying ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => !paying && (e.currentTarget.style.background = "rgba(251,146,60,0.22)")}
            onMouseLeave={(e) => !paying && (e.currentTarget.style.background = "rgba(251,146,60,0.12)")}
          >
            {paying ? (
              <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>Loading...</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>Continue Payment</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}