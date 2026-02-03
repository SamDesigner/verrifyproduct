"use client";
import { useState } from "react";
// import clippedImage from "@/public/images/clippedPropertyy.png";
import clippedImage from "@/public/images/clippedPropertyy.png"
import { usePropertyStore } from "@/store/usePropertyStore";
import CompanyImage from "@/public/images/companyImage.png";
import Link from "next/link";
import Image from "next/image";
import StepOne from "@/app/components/(FormComponents)/(CreateProperty)/StepOne";
import StepTwo from "@/app/components/(FormComponents)/(CreateProperty)/StepTwo";
import Map from "@/app/components/(FormComponents)/(CreateProperty)/Map";
import Button from "@/app/components/(FormComponents)/Button";
import { useAuthStore } from "@/store/useAuthStore";
const Properties = () => {
  const { submitPropertyDraft, loading } = usePropertyStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { user } = useAuthStore();
  if (!user) return;
  if (!user.hasCompanyProfile) return (
    <div className="flex flex-col bg-gray-900 rounded-xl items-center justify-center h-screen text-center gap-4">
      <Image
        className="h-[100px] w-[100px]"
        src={CompanyImage}
        alt="Company Image Icon"
      />
      <h2 className="text-2xl text-white font-semibold">
        You do not have a company profile
      </h2>
      <p className="text-gray-400">
        Create a company profile to list properties and manage assets.
      </p>
      <div>
        <div className="w-[300px]">
          <Link href="/create-company">
            <Button text="Create Company Profile" />
          </Link>
        </div>
      </div>
    </div>
  )
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
    <div className="p-5 bg-gray-900 ">
      <div className="flex gap-5">
        <div className="hidden md:flex flex-1  ">
          <Image
            className=" object-cover image_clip rounded-xl "
            src={clippedImage}
            alt="Property Image"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6 h-auto ">
          <div className="text-center">
            <h1 className="text-white text-[30px] md:text-[40px] font-semibold">
              Register Land Property
            </h1>
            <p className="text-gray-400">Step {step} of 3</p>
            <div className="flex justify-center gap-2 mt-5">
              <div className={`flex-1 h-3 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              <div className={`flex-1 h-3 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              <div className={`flex-1 h-3 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
            </div>
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
