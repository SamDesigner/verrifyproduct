
// "use client";

// import { useParams, useRouter } from "next/navigation";

// export default function SuccessPage() {
//   const { verificationId } = useParams();
//   const router = useRouter();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md">
//         <h1 className="text-green-500 text-2xl font-semibold mb-4">
//           Verification Initiated Successfully!
//         </h1>

//         <button
//           onClick={() => router.push(`/checkout/${verificationId}`)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { submitVerification } from "@/lib/api/verification";
import { useAuthReady } from "@/hooks/useAuthReady";
import { toastError, toastSuccess } from "@/lib/toast/toast";

export default function VerificationSuccessPage() {
  const router = useRouter();
  const { verificationId } = useParams<{ verificationId: string }>();
  const { isReady } = useAuthReady();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitForReview = async () => {
    if (!isReady || !verificationId) return;
    setSubmitting(true);
    try {
      await submitVerification(verificationId);
      toastSuccess("Verification submitted for review!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to submit for review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0f1117" }}>
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Verification Initiated!
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your property verification has been successfully initiated. Submit it for admin review when you&apos;re ready.
          </p>
        </div>

        {/* Verification ID */}
        {verificationId && (
          <div
            className="w-full px-4 py-3 rounded-xl flex items-center justify-between gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="text-slate-500 text-xs">Verification ID</span>
            <span className="text-slate-300 text-xs font-mono truncate">{verificationId}</span>
          </div>
        )}

        {/* What happens next */}
        <div
          className="w-full rounded-xl p-4 text-left space-y-3"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
        >
          <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
            What happens next
          </p>
          {[
            "Your request is saved and ready for review",
            "Submit it below to send it to our admin team",
            "An admin will be assigned to review your property",
            "You'll be notified of the outcome",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
              >
                {i + 1}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleSubmitForReview}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
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
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Submitting for Review...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
                Submit for Review
              </>
            )}
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: "transparent",
              color: "#475569",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}