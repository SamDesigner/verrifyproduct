"use client";
import { useState, useEffect } from "react";
import clippedImage from "@/public/images/clippedProperty.png";
import { usePropertyStore } from "@/store/usePropertyStore";
import Image from "next/image";
import StepOne from "@/app/components/(FormComponents)/(CreateProperty)/StepOne";
import StepTwo from "@/app/components/(FormComponents)/(CreateProperty)/StepTwo";
import Map from "@/app/components/(FormComponents)/(CreateProperty)/Map";
import Button from "@/app/components/(FormComponents)/Button";
const Properties = () => {
  const { submitPropertyDraft, loading } = usePropertyStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <Map />;
      default:
        return null;
    }
  };
  const handleNext = () => {
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
    await submitPropertyDraft();
  };
  return (
    <div className="p-5 bg-gray-900">
      <div className="flex min-h-screen h-screen ">
        <div className="flex-1 h-full">
          <Image
            className="h-full  object-cover image_clip rounded-xl "
            src={clippedImage}
            alt="Property Image"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-white text-[40px] font-semibold">
              Register Land Property
            </h1>
            <p className="text-gray-400">Step {step} of 3</p>
          </div>

          {renderStep()}
          <div className="flex gap-5 mt-5">
            {/* <Button text="Save draft" type="outline"/> */}
            {step > 1 && (
              <Button text="Previous" type="outline" onClick={handlePrevious} />
            )}

            {step < 3 && <Button text="Next" onClick={handleNext} />}
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
    </div>
  );
};

export default Properties;
