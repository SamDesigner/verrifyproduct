"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getVerificationById, assignVerification, submitVerdict,  } from "@/lib/api/adminVerification";
import { advanceVerificationStage  } from "@/lib/api/advanceStage";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useAuthStore } from "@/store/useAuthStore";
import { VerificationDetail, VerdictType } from "@/lib/types/verification";
import { VerificationBadge, VerdictModal } from "@/app/components/adminVerification";
import { AdvanceStageModal } from "@/app/components/adminVerification/AdvanceStageModal";
import {
  DetailCard,
  DetailRow,
  StageTimeline,
  VerificationDetailSkeleton,
} from "@/app/components/adminVerification";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// Stages that can be advanced and what they advance to
const ADVANCE_STAGE_MAP: Record<string, string> = {
  PAYMENT_VERIFIED: "STAGE_1",
  STAGE_1:          "STAGE_2",
  STAGE_2:          "STAGE_3",
  STAGE_3:          "VERIFICATION_COMPLETE",
};
const VerificationDetailPage = () => {
  const router = useRouter();
  const { verificationId } = useParams<{ verificationId: string }>();
  const { isReady } = useAuthReady();
  const currentUser = useAuthStore((state) => state.user);

  const [detail, setDetail] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [verdictModalOpen, setVerdictModalOpen] = useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);

  useEffect(() => {
    if (!isReady || !verificationId) return;
    setLoading(true);
    setError(null);
    getVerificationById(verificationId)
      .then((res) => setDetail(res.data))
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady, verificationId]);

  // ── Derived state ──────────────────────────────────────────────────────
  const isAssigned = !!detail?.reviewUser;
  const isAssignedToMe = detail?.reviewUser?.id === currentUser?.id;
  const isFinalized = ["VERIFICATION_ACCEPTED", "VERIFICATION_REJECTED", "VERIFICATION_COMPLETE"].includes(detail?.stage ?? "");
  const canBeAssigned = detail?.stage === "PENDING_ACCEPTANCE";
  const canAdvanceStage = !!ADVANCE_STAGE_MAP[detail?.stage ?? ""];
  const nextStage = ADVANCE_STAGE_MAP[detail?.stage ?? ""] ?? "";

  // ── Assign handler ─────────────────────────────────────────────────────
const handleAssign = async () => {
  if (!verificationId) return;
  setAssigning(true);
  try {
    await assignVerification(verificationId);
      const updated = await getVerificationById(verificationId);
      setDetail(updated.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to assign");
    } finally {
      setAssigning(false);
    }
  };

  // ── Verdict handler ────────────────────────────────────────────────────
  const handleVerdict = async (verdict: VerdictType, comments: string) => {
    if (!verificationId) return;
    await submitVerdict(verificationId, { verdict, comments });
    const updated = await getVerificationById(verificationId);
    setDetail(updated.data);
  };

  // ── Advance stage handler ──────────────────────────────────────────────
  const handleAdvanceStage = async (adminComments: string, verificationFiles: string[]) => {
    if (!verificationId) return;
    await advanceVerificationStage(verificationId, { adminComments, verificationFiles });
    const updated = await getVerificationById(verificationId);
    setDetail(updated.data);
  };

  return (
    // style={{ background: "#0f1117" }}
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >

      {/* Header */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 flex-shrink-0"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e2535")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#161b27")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white tracking-tight">Verification Request</h1>
          {detail && !loading && (
            <p className="text-slate-500 text-xs mt-0.5">ID: {detail.id}</p>
          )}
        </div>

        {/* Action buttons */}
        {detail && !loading && (
          <div className="flex items-center gap-2 flex-wrap">
            <VerificationBadge stage={detail.stage} />

            {/* Assign to Me */}
            {!isAssigned && !isFinalized && canBeAssigned && (
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{
                  background: assigning ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)",
                  color: assigning ? "#4338ca" : "#818cf8",
                  border: "1px solid rgba(99,102,241,0.3)",
                  cursor: assigning ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => !assigning && (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
                onMouseLeave={(e) => !assigning && (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
              >
                {assigning ? (
                  <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>Assigning...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>Assign to Me</>
                )}
              </button>
            )}

            {/* Assigned to someone else */}
            {isAssigned && !isAssignedToMe && !isFinalized && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                Assigned to {detail.reviewUser?.firstName}
              </div>
            )}

            {/* Submit Verdict */}
            {isAssignedToMe && !isFinalized && detail.stage === "IN_REVIEW" && (
              <button
                onClick={() => setVerdictModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(52,211,153,0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(52,211,153,0.12)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                Submit Verdict
              </button>
            )}

            {/* Advance Stage */}
            {canAdvanceStage && (
              <button
                onClick={() => setAdvanceModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,146,60,0.22)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251,146,60,0.12)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Advance to {nextStage.replace(/_/g, " ")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <VerificationDetailSkeleton />
      ) : error ? (
        <div className="rounded-xl px-6 py-16 text-center"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => router.back()} className="mt-3 text-xs text-slate-400 underline">Go back</button>
        </div>
      ) : detail ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DetailCard title="Property Details">
              <DetailRow label="Name" value={detail.property?.name} />
              <DetailRow label="Address" value={detail.property?.address} />
              <DetailRow label="City" value={detail.property?.city} />
              <DetailRow label="State" value={detail.property?.state} />
              <DetailRow label="Type" value={detail.property?.propertyType} />
              <DetailRow label="Status" value={detail.property?.propertyVerificationStatus} />
              <DetailRow label="Sub-property" value={detail.property?.isSubProperty} />
              <DetailRow label="Area" value={detail.property?.area} />
            </DetailCard>

            <DetailCard title="Property Owner">
              <DetailRow label="Name" value={detail.user ? `${detail.user.firstName} ${detail.user.lastName ?? ""}`.trim() : null} />
              <DetailRow label="Email" value={detail.user?.email} />
              <DetailRow label="Phone" value={detail.user?.phoneNumber} />
              <DetailRow label="Role" value={detail.user?.role} />
              <DetailRow label="Verified" value={detail.user?.isVerified} />
              <DetailRow label="2FA Enabled" value={detail.user?.is2fa} />
              <DetailRow label="Has Company" value={detail.user?.hasCompanyProfile} />
              <DetailRow label="Last Login" value={detail.user?.lastLogin ? formatDate(detail.user.lastLogin) : null} />
            </DetailCard>

            <DetailCard title="Review Info">
              <DetailRow label="Case ID" value={detail.caseId} />
              <DetailRow label="Admin Comments" value={detail.adminComments} />
              <DetailRow label="Reviewed At" value={detail.reviewedAt ? formatDate(detail.reviewedAt) : null} />
              <DetailRow label="Reviewer" value={detail.reviewUser ? `${detail.reviewUser.firstName} ${detail.reviewUser.lastName ?? ""}`.trim() : null} />
              <DetailRow label="Reviewer Email" value={detail.reviewUser?.email} />
              <DetailRow label="Created At" value={formatDate(detail.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(detail.updatedAt)} />
            </DetailCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DetailCard title="Documents">
                {[
                  { label: "Certification of Occupancy", value: detail.property?.certificationOfOccupancy },
                  { label: "Contract of Sale", value: detail.property?.contractOfSale },
                  { label: "Survey Plan", value: detail.property?.surveyPlan },
                  { label: "Letter of Intent", value: detail.property?.letterOfIntent },
                  { label: "Deed of Conveyance", value: detail.property?.deedOfConveyance },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-slate-500 text-xs">{label}</span>
                    {value ? (
                      <a href={value} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        View Document ↗
                      </a>
                    ) : (
                      <span className="text-slate-600 text-xs">Not provided</span>
                    )}
                  </div>
                ))}
                {detail.verificationFiles?.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-2">Verification Files</p>
                    {detail.verificationFiles.map((file, i) => (
                      <a key={i} href={file} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-1">
                        File {i + 1} ↗
                      </a>
                    ))}
                  </div>
                )}
              </DetailCard>
            </div>
            <StageTimeline stageHistory={detail.stageHistory} currentStage={detail.stage} />
          </div>
        </div>
      ) : null}

      {/* Modals */}
      <VerdictModal
        isOpen={verdictModalOpen}
        onClose={() => setVerdictModalOpen(false)}
        onSubmit={handleVerdict}
      />
      <AdvanceStageModal
        isOpen={advanceModalOpen}
        currentStage={detail?.stage ?? ""}
        nextStage={nextStage}
        onClose={() => setAdvanceModalOpen(false)}
        onSubmit={handleAdvanceStage}
      />
    </div>
  );
};

export default VerificationDetailPage;