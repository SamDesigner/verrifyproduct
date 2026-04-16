"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserVerificationById, submitVerification } from "@/lib/api/verification";
import { getVerificationOrder } from "@/lib/api/payment";
import { useAuthReady } from "@/hooks/useAuthReady";
import { VerificationDetail } from "@/lib/types/verification";
import { RequestStageBadge } from "@/app/components/myRequests";
import {
  VerificationSectionCard,
  VerificationDetailRow,
  VerificationDocumentRow,
  VerificationStageTimeline,
  VerificationDetailSkeleton,
  VerificationStatusBanner,
} from "@/app/components/userVerification";
import { ProceedToPaymentButton } from "@/app/components/(Payment)/ProceedToPaymentButton";
import { toastError, toastSuccess } from "@/lib/toast/toast";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const UserVerificationDetailPage = () => {
  const router = useRouter();
  const { verificationId } = useParams<{ verificationId: string }>();
  const { isReady } = useAuthReady();

  const [detail, setDetail] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);

  const refetchDetail = async () => {
    if (!verificationId) return;
    const updated = await getUserVerificationById(verificationId);
    setDetail(updated.data);
  };

  useEffect(() => {
    if (!isReady || !verificationId) return;
    setLoading(true);
    getUserVerificationById(verificationId)
      .then((res) => setDetail(res.data))
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady, verificationId]);

  const canSubmit = detail?.stage === "INITIATED";
  const canUpdate = detail?.stage === "INITIATED";
  const canContinuePay = detail?.stage === "PENDING_PAYMENT";

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmitForReview = async () => {
    if (!verificationId) return;
    setSubmitting(true);
    try {
      await submitVerification(verificationId);
      toastSuccess("Submitted for review successfully!");
      await refetchDetail();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Continue payment (already initialized) ─────────────────────────────
  const handleContinuePayment = async () => {
    if (!verificationId) return;
    setPaying(true);
    try {
      const res = await getVerificationOrder(verificationId);
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
          await refetchDetail();
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
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 shrink-0"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e2535")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#161b27")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">Verification Details</h1>
          {detail && !loading && (
            <p className="text-slate-500 text-xs mt-0.5 truncate">ID: {detail.id}</p>
          )}
        </div>

        {detail && !loading && (
          <div className="flex items-center gap-2 flex-wrap">
            <RequestStageBadge stage={detail.stage} />

            {canUpdate && (
              <button
                onClick={() => router.push(`/dashboard/my-requests/${verificationId}/update`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Update
              </button>
            )}

            {canSubmit && (
              <button
                onClick={handleSubmitForReview}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  background: submitting ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)",
                  color: submitting ? "#4338ca" : "#818cf8",
                  border: "1px solid rgba(99,102,241,0.3)",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
                onMouseLeave={(e) => !submitting && (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
              >
                {submitting ? (
                  <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>Submitting...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>Submit for Review</>
                )}
              </button>
            )}

            {/* Proceed to Payment — navigates to packages page */}
            <ProceedToPaymentButton verificationId={verificationId} stage={detail.stage} />

            {/* Continue Payment */}
            {canContinuePay && (
              <button
                onClick={handleContinuePayment}
                disabled={paying}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  background: paying ? "rgba(251,146,60,0.08)" : "rgba(251,146,60,0.15)",
                  color: paying ? "#c2410c" : "#fb923c",
                  border: "1px solid rgba(251,146,60,0.3)",
                  cursor: paying ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => !paying && (e.currentTarget.style.background = "rgba(251,146,60,0.25)")}
                onMouseLeave={(e) => !paying && (e.currentTarget.style.background = "rgba(251,146,60,0.15)")}
              >
                {paying ? (
                  <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>Loading...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>Continue Payment</>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <VerificationDetailSkeleton />
      ) : error ? (
        <div className="rounded-2xl px-6 py-16 text-center"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => router.back()} className="mt-3 text-xs text-slate-400 underline">Go back</button>
        </div>
      ) : detail ? (
        <div className="space-y-4">
          <VerificationStatusBanner stage={detail.stage} adminComments={detail.adminComments} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <VerificationSectionCard title="Property Details" icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <VerificationDetailRow label="Property Name" value={detail.property?.name} />
                  <VerificationDetailRow label="Property Type" value={detail.property?.propertyType} />
                  <VerificationDetailRow label="Address" value={detail.property?.address} />
                  <VerificationDetailRow label="City" value={detail.property?.city} />
                  <VerificationDetailRow label="State" value={detail.property?.state} />
                  <VerificationDetailRow label="Area" value={detail.property?.area} />
                  <VerificationDetailRow label="Sub-property" value={detail.property?.isSubProperty} />
                  <VerificationDetailRow label="Verification Status" value={detail.property?.propertyVerificationStatus?.replace(/_/g, " ")} />
                  <VerificationDetailRow label="Created" value={formatDate(detail.createdAt)} />
                  <VerificationDetailRow label="Last Updated" value={formatDate(detail.updatedAt)} />
                </div>
              </VerificationSectionCard>
            </div>

            <VerificationSectionCard title="Progress" icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }>
              <VerificationStageTimeline stageHistory={detail.stageHistory} currentStage={detail.stage} />
            </VerificationSectionCard>
          </div>

          <VerificationSectionCard title="Documents" icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          }>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <VerificationDocumentRow label="Certification of Occupancy" value={detail.property?.certificationOfOccupancy} />
              <VerificationDocumentRow label="Contract of Sale" value={detail.property?.contractOfSale} />
              <VerificationDocumentRow label="Survey Plan" value={detail.property?.surveyPlan} />
              <VerificationDocumentRow label="Letter of Intent" value={detail.property?.letterOfIntent} />
              <VerificationDocumentRow label="Deed of Conveyance" value={detail.property?.deedOfConveyance} />
            </div>
            {detail.verificationFiles?.length > 0 && (
              <div className="pt-3 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs text-slate-500 mb-3">Verification Files</p>
                <div className="flex flex-wrap gap-2">
                  {detail.verificationFiles.map((file, i) => (
                    <a key={i} href={file} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                      File {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </VerificationSectionCard>
        </div>
      ) : null}
    </div>
  );
};

export default UserVerificationDetailPage;