"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepOne from "@/app/components/(FormComponents)/(VerifyProperty)/StepOne";
import StepTwo from "@/app/components/(FormComponents)/(VerifyProperty)/StepTwo";
import VerificationMap from "@/app/components/(FormComponents)/(VerifyProperty)/VerificationMap";
import { useVerificationStore } from "@/store/useVerificationStore";
import { toastError, toastSuccess } from "@/lib/toast/toast";
import { useAuthReady } from "@/hooks/useAuthReady";

const STEPS = [
  {
    number: 1,
    title: "Property Details",
    description: "Basic info about the property",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Documents",
    description: "Upload required documents",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Property Boundary",
    description: "Draw on the map",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

export default function InitiateVerificationPage() {
  const { isReady } = useAuthReady();
  const router = useRouter();
  const { draft, submitVerification, loading } = useVerificationStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!draft.name.trim() || !draft.description.trim()) {
        toastError("Name and description are required.");
        return false;
      }
      if (!draft.address.trim() || !draft.city.trim() || !draft.state.trim() || !draft.country.trim()) {
        toastError("Address, city, state and country are required.");
        return false;
      }
    }
    if (step === 3) {
      if (!draft.polygon) {
        toastError("Please draw the property boundary on the map.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      const result = await submitVerification();
      toastSuccess("Verification initiated successfully!");
      router.push(`/dashboard/verifyproperty/success/${result?.id}`);
    } catch {
      toastError("Failed to initiate verification.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepOne />;
      case 2: return <StepTwo />;
      case 3: return <VerificationMap />;
    }
  };

  return (
    // style={{ background: "#0f1117" }}
    <div className="min-h-screen p-6 bg-gray-900 rounded-xl" >
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Initiate Property Verification
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete all steps to submit your property for verification
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isCompleted = step > s.number;
            const isActive = step === s.number;
            return (
              <div key={s.number} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col justify-center items-center gap-3 flex-1">
                  {/* Circle */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: isCompleted
                        ? "rgba(52,211,153,0.15)"
                        : isActive
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(255,255,255,0.04)",
                      border: isCompleted
                        ? "1px solid rgba(52,211,153,0.4)"
                        : isActive
                        ? "1px solid rgba(99,102,241,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                      color: isCompleted ? "#34d399" : isActive ? "#818cf8" : "#475569",
                    }}
                  >
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : s.icon}
                  </div>

                  {/* Label */}
                  <div className="hidden sm:block">
                    <p
                      className="text-xs font-semibold text-center"
                      style={{ color: isActive ? "#c7d2fe" : isCompleted ? "#34d399" : "#475569" }}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs text-center text-slate-600">{s.description}</p>
                  </div>
                </div>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className="h-[5px] flex-1 mx-6 transition-all duration-300"
                    style={{ background: step > s.number ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Step header */}
          <div className="mb-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white font-semibold">{STEPS[step - 1].title}</p>
            <p className="text-slate-500 text-xs mt-0.5">{STEPS[step - 1].description}</p>
          </div>

          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: step === 1 ? "transparent" : "rgba(255,255,255,0.04)",
              color: step === 1 ? "#1e293b" : "#94a3b8",
              border: `1px solid ${step === 1 ? "transparent" : "rgba(255,255,255,0.08)"}`,
              cursor: step === 1 ? "not-allowed" : "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Previous
          </button>

          {/* Step counter */}
          <p className="text-slate-600 text-xs">Step {step} of 3</p>

          {/* Next / Submit */}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{
                background: "rgba(99,102,241,0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              // disabled={loading}
                disabled={loading || !isReady}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{
                background: loading ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.15)",
                color: loading ? "#4338ca" : "#818cf8",
                border: "1px solid rgba(99,102,241,0.3)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Initiating...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                  Initiate Verification
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}