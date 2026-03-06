"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getVerificationById } from "@/lib/api/adminVerification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { VerificationDetail } from "@/lib/types/verification";
import { VerificationBadge } from "@/app/components/adminVerification/VerificationBadge";
import {
  DetailCard,
  DetailRow,
  StageTimeline,
  VerificationDetailSkeleton,
} from "@/app/components/adminVerification";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const VerificationDetailPage = () => {
  const router = useRouter();
  const { verificationId } = useParams<{ verificationId: string }>();
  const { isReady } = useAuthReady();

  const [detail, setDetail] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !verificationId) return;

    setLoading(true);
    setError(null);

    getVerificationById(verificationId)
      .then((res) => setDetail(res.data))
      .catch((err) => setError(err.message ?? "Something went wrong"))
      .finally(() => setLoading(false));
  }, [isReady, verificationId]);

  return (
    <div className="min-h-screen p-6" style={{ background: "#0f1117" }}>

      {/* Back button + header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e2535")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#161b27")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Verification Request
          </h1>
          {detail && !loading && (
            <p className="text-slate-500 text-xs mt-0.5">ID: {detail.id}</p>
          )}
        </div>

        {detail && !loading && (
          <div className="ml-auto">
            <VerificationBadge stage={detail.stage} />
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
          <button
            onClick={() => router.back()}
            className="mt-3 text-xs text-slate-400 underline"
          >
            Go back
          </button>
        </div>
      ) : detail ? (
        <div className="space-y-4">

          {/* Row 1: Property + Owner + Reviewer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Property details */}
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

            {/* Owner details */}
            <DetailCard title="Property Owner">
              <DetailRow
                label="Name"
                value={
                  detail.user
                    ? `${detail.user.firstName} ${detail.user.lastName ?? ""}`.trim()
                    : null
                }
              />
              <DetailRow label="Email" value={detail.user?.email} />
              <DetailRow label="Phone" value={detail.user?.phoneNumber} />
              <DetailRow label="Role" value={detail.user?.role} />
              <DetailRow label="Verified" value={detail.user?.isVerified} />
              <DetailRow label="2FA Enabled" value={detail.user?.is2fa} />
              <DetailRow label="Has Company" value={detail.user?.hasCompanyProfile} />
              <DetailRow
                label="Last Login"
                value={detail.user?.lastLogin ? formatDate(detail.user.lastLogin) : null}
              />
            </DetailCard>

            {/* Review info */}
            <DetailCard title="Review Info">
              <DetailRow label="Case ID" value={detail.caseId} />
              <DetailRow label="Admin Comments" value={detail.adminComments} />
              <DetailRow
                label="Reviewed At"
                value={detail.reviewedAt ? formatDate(detail.reviewedAt) : null}
              />
              <DetailRow
                label="Reviewer"
                value={
                  detail.reviewUser
                    ? `${detail.reviewUser.firstName} ${detail.reviewUser.lastName ?? ""}`.trim()
                    : null
                }
              />
              <DetailRow label="Reviewer Email" value={detail.reviewUser?.email} />
              <DetailRow label="Created At" value={formatDate(detail.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(detail.updatedAt)} />
            </DetailCard>
          </div>

          {/* Row 2: Documents + Stage timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Documents */}
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
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        View Document ↗
                      </a>
                    ) : (
                      <span className="text-slate-600 text-xs">Not provided</span>
                    )}
                  </div>
                ))}

                {/* Verification files */}
                {detail.verificationFiles?.length > 0 && (
                  <>
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-xs text-slate-500 mb-2">Verification Files</p>
                      {detail.verificationFiles.map((file, i) => (
                        <a
                          key={i}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-1"
                        >
                          File {i + 1} ↗
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </DetailCard>
            </div>

            {/* Stage timeline */}
            <StageTimeline
              stageHistory={detail.stageHistory}
              currentStage={detail.stage}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VerificationDetailPage;