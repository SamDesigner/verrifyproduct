"use client";
import { useState } from "react";
import { initializeVerificationPayment } from "@/lib/api/payment";
import { toastError } from "@/lib/toast/toast";

interface ProceedToPaymentButtonProps {
  verificationId: string;
  stage: string;
}

export function ProceedToPaymentButton({
  verificationId,
  stage,
}: ProceedToPaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  // Only show on VERIFICATION_ACCEPTED stage
  if (stage !== "VERIFICATION_ACCEPTED") return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await initializeVerificationPayment(verificationId);

      // Paystack returns an authorization URL to redirect to
     const authUrl = res.data?.paystackDetails?.authorization_url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        // Log so we can see the actual response shape
        console.log("Payment response data:", res.data);
        toastError("Could not retrieve payment URL. Check console for response.");
      }
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
      style={{
        background: loading ? "rgba(52,211,153,0.1)" : "rgba(52,211,153,0.15)",
        color: loading ? "#059669" : "#34d399",
        border: "1px solid rgba(52,211,153,0.3)",
        cursor: loading ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) =>
        !loading && (e.currentTarget.style.background = "rgba(52,211,153,0.25)")
      }
      onMouseLeave={(e) =>
        !loading && (e.currentTarget.style.background = "rgba(52,211,153,0.15)")
      }
    >
      {loading ? (
        <>
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Proceed to Payment
        </>
      )}
    </button>
  );
}