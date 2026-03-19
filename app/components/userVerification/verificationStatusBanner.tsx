interface VerificationStatusBannerProps {
  stage: string;
  adminComments?: string | null;
}

export function VerificationStatusBanner({
  stage,
  adminComments,
}: VerificationStatusBannerProps) {
  const isAccepted = stage === "VERIFICATION_ACCEPTED";
  const isRejected = stage === "VERIFICATION_REJECTED";
  const isFinalized = isAccepted || isRejected || stage === "VERIFICATION_COMPLETE";

  return (
    <div className="flex flex-col gap-3">
      {/* Admin comments banner */}
      {adminComments && (
        <div
          className="rounded-xl px-5 py-4 flex items-start gap-3"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <svg
            className="shrink-0 mt-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <div>
            <p className="text-amber-400 text-xs font-semibold mb-0.5">Admin Comment</p>
            <p className="text-slate-300 text-xs leading-relaxed">{adminComments}</p>
          </div>
        </div>
      )}

      {/* Finalized banner */}
      {isFinalized && (
        <div
          className="rounded-xl px-5 py-4 flex items-start gap-3"
          style={{
            background: isAccepted ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
            border: `1px solid ${isAccepted ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
          }}
        >
          <svg
            className="shrink-0 mt-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isAccepted ? "#34d399" : "#f87171"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isAccepted ? (
              <path d="M20 6L9 17l-5-5" />
            ) : (
              <path d="M18 6L6 18M6 6l12 12" />
            )}
          </svg>
          <p
            className="text-xs font-medium"
            style={{ color: isAccepted ? "#34d399" : "#f87171" }}
          >
            {isAccepted
              ? "Your verification has been accepted!"
              : "Your verification was rejected. Please review admin comments and resubmit."}
          </p>
        </div>
      )}
    </div>
  );
}