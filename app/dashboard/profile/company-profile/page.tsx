"use client";
import { useCompanyStore } from "@/store/useCompanyStore";
import CompanyImage from "@/public/images/companyImage.png";
import Image from "next/image";
import { useEffect } from "react";
import Button from "@/app/components/(FormComponents)/Button";
import Link from "next/link";
export default function Page() {
  const { hasCompany, company, loading, fetchCompany } = useCompanyStore();
  const companyData = [
    { label: "Company Name", value: company?.name },
    { label: "Verification Status", value: company?.companyVerificationStatus },
    { label: "Phone Number", value: company?.phoneNumber },
    { label: "Proof of Address Type", value: company?.proofOfAddressType },
    { label: "Proof of Address", value: company?.proofOfAddress },
    { label: "Address", value: company?.address },
    { label: "City", value: company?.city },
    { label: "State", value: company?.state },
  ];

  useEffect(() => {
    fetchCompany().catch(() => {});
  }, [fetchCompany]);
  if (loading) {
    return <p className="text-white">Loading company info...</p>;
  }
  if (!hasCompany) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
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
    );
  }

  return (
    <div className="bg-glass-glow w-full p-6 flex flex-col gap-[30px]  text-white">
      <div className="flex justify-between text-white">
        <h1 className="text-[25px] font-semibold">Personal Info</h1>
        <button className="border border-gray-300 rounded-xl py-1 px-5">
          Edit Company Profile
        </button>
      </div>
      <div className="grid grid-cols-3 gap-[30px]">
        {companyData.map((item, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="font-semibold text-white">{item.label}</h3>
            { item.label !== "Proof of Address" ? <p className="text-gray-300 text-sm">{item.value || "-"}</p> : <a target="_blank" className="underline" href={item.value}>Proof of Address</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
