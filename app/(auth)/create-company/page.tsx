"use client";

import { toastSuccess, toastError } from "@/lib/toast/toast";
import { useRouter } from "next/navigation";
import { FileUploadResponse } from "@/lib/api/file";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import Button from "@/app/components/(FormComponents)/Button";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useState } from "react";
import { ValidationError } from "yup";
import Image from "next/image";
import authLogo from "@/public/images/authLogo.png";
import { createCompanySchema } from "@/lib/validation/companySchema";
import { useAuthStore } from "@/store/useAuthStore";
export default function CreateCompanyPage() {
  const router = useRouter();
  const {refreshUser} = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { companyDraft, updateDraftField, submitCompanyDraft } =
    useCompanyStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    setErrors({});
    try {
      await createCompanySchema.validate(companyDraft, {
        abortEarly: false,
      });

      await submitCompanyDraft();
      await refreshUser();
      toastSuccess("Company Profile created successfully");
      
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ValidationError) {
        const formErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            formErrors[error.path] = error.message;
          }
        });
        setErrors(formErrors);
        toastError("Please fix the errors in the form");
      } else {
        toastError("Failed to create company");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageUpload = (file: FileUploadResponse) => {
    updateDraftField("profileImage", file.url);
  };

  const handleProofOfAddressUpload = (file: FileUploadResponse) => {
    updateDraftField("proofOfAddress", file.url);
  };

  return (
    <div className="max-w-2xl mx-auto md:mt-10 md:p-6  rounded-lg bg-glass-glow">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center ">
          <Image src={authLogo} alt="Logo" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Company Profile
        </h2>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 ">
          <label className="text-gray-200">Company Name</label>
          <input
            placeholder="Company Name"
            className="glass-input"
            value={companyDraft.name}
            onChange={(e) => updateDraftField("name", e.target.value)}
          />
          {errors.name && (
            <span className="text-red-400 text-sm">{errors.name}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 ">
          <label className="text-gray-200">Company Description</label>
          <textarea
            placeholder="Description"
            className="glass-input"
            value={companyDraft.description}
            onChange={(e) => updateDraftField("description", e.target.value)}
          />
          {errors.name && (
            <span className="text-red-400 text-sm">{errors.description}</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-2 flex-1 ">
            <label className="text-gray-200">Phone Number</label>
            <input
              placeholder="Phone Number"
              className="glass-input"
              value={companyDraft.phoneNumber}
              onChange={(e) => updateDraftField("phoneNumber", e.target.value)}
            />
            {errors.name && (
              <span className="text-red-400 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-gray-200">Proof of Address</label>
            <select
              className="glass-input bg-gray-800!"
              value={companyDraft.proofOfAddressType}
              onChange={(e) =>
                updateDraftField("proofOfAddressType", e.target.value)
              }
            >
              <option value="" disabled>
                Select Proof of Address Type
              </option>
              <option value="UTILITY_BILL">Utility Bill</option>
              <option value="VOTER_CARD">Voter Card</option>
              <option value="BANK_STATEMENT">Bank Statement</option>
              <option value="LEASE_AGREEMENT">Lease Agreement</option>
              <option value="DRIVER_LICENSE">Driver License</option>
            </select>
            {errors.name && (
              <span className="text-red-400 text-sm">
                {errors.proofOfAddressType}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="flex-1">
            <FileUpload
              fileType="COMPANY_PROFILE_PICTURE"
              label="Profile Image"
              allowedTypes={["image/jpeg", "image/png"]}
              onUploadSuccess={handleProfileImageUpload}
            />
            {errors.name && (
              <span className="text-red-400 text-sm">
                {errors.profileImage}
              </span>
            )}
          </div>
          <div className="flex-1">
            <FileUpload
              fileType="PROOF_OF_ADDRESS"
              label="Proof of Address"
              allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
              onUploadSuccess={handleProofOfAddressUpload}
            />
            {errors.name && (
              <span className="text-red-400 text-sm">
                {errors.proofOfAddress}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <label className="text-gray-200">Company Address</label>
          <input
            placeholder="Address"
            className="glass-input"
            value={companyDraft.address}
            onChange={(e) => updateDraftField("address", e.target.value)}
          />
          {errors.name && (
            <span className="text-red-400 text-sm">{errors.address}</span>
          )}
        </div>
        <div className="flex  gap-5 ">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-gray-200">City</label>
            <input
              value={companyDraft.city}
              onChange={(e) => updateDraftField("city", e.target.value)}
              placeholder="City"
              className="glass-input"
            />
            {errors.name && (
              <span className="text-red-400 text-sm">{errors.city}</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-gray-200">State</label>
            <input
              value={companyDraft.state}
              onChange={(e) => updateDraftField("state", e.target.value)}
              placeholder="State"
              className="glass-input"
            />
            {errors.name && (
              <span className="text-red-400 text-sm">{errors.state}</span>
            )}
          </div>
        </div>

        <Button
          text={isLoading ? "Creating..." : "Create Company"}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
