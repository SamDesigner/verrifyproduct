"use client";
import { useRouter } from "next/navigation";

interface ProceedToPaymentButtonProps {
  verificationId: string;
  stage: string;
}

export function ProceedToPaymentButton({
  verificationId,
  stage,
}: ProceedToPaymentButtonProps) {
  const router = useRouter();

  if (stage !== "VERIFICATION_ACCEPTED") return null;

  const handleClick = () => {
    router.push(`/dashboard/my-requests/${verificationId}/packages`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
      style={{
        background: "rgba(52,211,153,0.15)",
        color: "#34d399",
        border: "1px solid rgba(52,211,153,0.3)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(52,211,153,0.25)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(52,211,153,0.15)")
      }
    >
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
    </button>
  );
}