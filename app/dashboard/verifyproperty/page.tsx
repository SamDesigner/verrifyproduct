"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepOne from "@/app/components/(FormComponents)/(VerifyProperty)/StepOne";
import StepTwo from "@/app/components/(FormComponents)/(VerifyProperty)/StepTwo";
import VerificationMap from "@/app/components/(FormComponents)/(VerifyProperty)/VerificationMap";
// import StepTwo from "@/app/components/verification/StepTwo";
// import VerificationMap from "@/app/components/verification/VerificationMap";
import Button from "@/app/components/(FormComponents)/Button";
import { useVerificationStore } from "@/store/useVerificationStore";
import { toastError, toastSuccess } from "@/lib/toast/toast";

export default function InitiateVerificationPage() {
  const router = useRouter();
  const { draft, submitVerification, loading } = useVerificationStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ✅ Step Validation Logic
  const validateStep = (): boolean => {
    if (step === 1) {
      if (!draft.name.trim() || !draft.description.trim()) {
        toastError("Name and description are required.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !draft.address.trim() ||
        !draft.city.trim() ||
        !draft.state.trim() ||
        !draft.country.trim()
      ) {
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

    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const result = await submitVerification();
      console.log("Verification Result:", result);
      toastSuccess("Verification initiated successfully!");
      const verificationId = result?.id;
      console.log('Verificcaton ID', verificationId);
      router.push(`/dashboard/verifyproperty/success/${verificationId}`);
    } catch (error) {
      toastError("Failed to initiate verification.");
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <VerificationMap />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-white text-3xl font-semibold">
            Initiate Property Verification
          </h1>
          <p className="text-gray-400">Step {step} of 3</p>

          {/* Progress Bar */}
          <div className="flex justify-center gap-2 mt-4">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-gray-600"}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-gray-600"}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-gray-600"}`} />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800 p-6 rounded-xl">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-end">
          {step > 1 && (
            <Button
              text="Previous"
              type="outline"
              onClick={handlePrevious}
            />
          )}

          {step < 3 && (
            <Button
              text="Next"
              onClick={handleNext}
            />
          )}

          {step === 3 && (
            <Button
              text={loading ? "Submitting..." : "Submit"}
              onClick={handleSubmit}
              disabled={loading}
            />
          )}
        </div>

      </div>
    </div>
  );
}