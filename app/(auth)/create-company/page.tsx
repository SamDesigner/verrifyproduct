"use client";

import { toastSuccess, toastError } from "@/lib/toast/toast";
import { useRouter } from "next/navigation";
import { FileUploadResponse } from "@/lib/api/file";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import Button from "@/app/components/(FormComponents)/Button";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useState } from "react";
export default function CreateCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { companyDraft, updateDraftField, submitCompanyDraft } =
    useCompanyStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await submitCompanyDraft();
      toastSuccess("Company Profile created successfully");
      router.push("/dashboard");
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Failed to create company"
      );
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg bg-glass-glow">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Create Company Profile
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          placeholder="Company Name"
          className="glass-input"
          value={companyDraft.name}
          onChange={(e) => updateDraftField("name", e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="glass-input"
          value={companyDraft.description}
          onChange={(e) => updateDraftField("description", e.target.value)}
        />

        <input
          placeholder="Phone Number"
          className="glass-input"
          value={companyDraft.phoneNumber}
          onChange={(e) => updateDraftField("phoneNumber", e.target.value)}
        />
        <select
          className="glass-input text-black"
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

        <FileUpload
          fileType="COMPANY_PROFILE_PICTURE"
          label="Profile Image"
          allowedTypes={["image/jpeg", "image/png"]}
          onUploadSuccess={handleProfileImageUpload}
        />

        <FileUpload
          fileType="PROOF_OF_ADDRESS"
          label="Proof of Address"
          allowedTypes={["image/jpeg", "image/png", "application/pdf"]}
          onUploadSuccess={handleProofOfAddressUpload}
        />

        <input
          placeholder="Address"
          className="glass-input"
          value={companyDraft.address}
          onChange={(e) => updateDraftField("address", e.target.value)}
        />

        <input
          value={companyDraft.city}
          onChange={(e) => updateDraftField("city", e.target.value)}
          placeholder="City"
          className="glass-input"
        />

        <input
          value={companyDraft.state}
          onChange={(e) => updateDraftField("state", e.target.value)}
          placeholder="State"
          className="glass-input"
        />

        <Button
          text={isLoading ? "Creating..." : "Create Company"}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
