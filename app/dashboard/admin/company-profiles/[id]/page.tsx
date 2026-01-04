"use client";
import { getCompanyById } from "@/lib/api/company";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { updateCompanyVerificationStatus } from "@/lib/api/companyProfileAdmin";

import { ImNewTab } from "react-icons/im";
import Image from "next/image";
interface CompanyStructure {

    id: string;

    name: string;
    description: string;
    verificationMessage: string;
    phoneNumber: string;
    companyVerificationStatus: string;
    proofOfAddressType: string;
    proofOfAddress: string;
    profileImage: string;
    address: string;
    city: string;
    state: string;
  
}
const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyStructure | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;

    const fetchCompany = async () => {
      try {
        const companyData = await getCompanyById(id);
        setCompany(companyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load company");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);
  const handleUpdateStatus = async (
    companyId: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    try {
      await updateCompanyVerificationStatus(companyId, status);

      // setCompanies((prev) =>
      //   prev.map((c) =>
      //     c.companyId === companyId
      //       ? { ...c, companyVerificationStatus: status }
      //       : c
      //   )
      // );
      setCompany((prev) =>
        prev && prev.id === companyId
          ? { ...prev, companyVerificationStatus: status }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update company status");
    }
  };
  if (loading) {
    return <p className="text-white">Loading company...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!company) {
    return <p className="text-gray-400">Company not found</p>;
  }
  return (
    <div className="h-screen flex flex-col gap-5 bg_glass_glow ">
      <div className="flex w-full gap-10">
        <div className="flex-1">
          <Image
            src={company.profileImage || "/images/companyImage.png"}
            width={200}
            height={200}
            alt="Company Image"
            className="h-[400px] w-full object-cover"
          />
        </div>
        <div className="flex-3 h-fit gap-10 grid grid-cols-2">
          <div className="flex flex-col">
            <h3 className="text-gray-300 font-semibold text-[20px] ">
              Company Name
            </h3>
            <h1 className=" font-bold mb-2 text-white  text-[20px]">
              {company.name}
            </h1>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold text-[20px] ">
              Company Phone Number
            </h3>
            <h1 className=" font-bold mb-2 text-white  text-[20px]">
              {company.phoneNumber}
            </h1>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold text-[20px] ">
              Company Proof of Address Type
            </h3>
            <h1 className=" font-bold mb-2 text-white  text-[20px]">
              {company.proofOfAddressType}
            </h1>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold text-[20px] ">
              Company Proof of Address{" "}
            </h3>
            <h1 className=" font-bold mb-2 text-white  text-[20px]">
              <a
                href={company.proofOfAddress}
                target="_blank"
                className="flex items-center gap-2 font-300 underline"
              >
                <span>
                  <ImNewTab />
                </span>{" "}
                Proof of Address
              </a>
            </h1>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold text-[20px] ">
              Verification Status
            </h3>
            <h1
              className={`${
                company.companyVerificationStatus === "VERIFIED"
                  ? "bg-green-900 text-white"
                  : "bg-yellow-500 text-black"
              } font-bold mb-2 text-white  text-[20px] w-fit px-3 py-1 rounded-full`}
            >
              {company.companyVerificationStatus}
            </h1>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold text-[20px] ">State </h3>
            <h1 className=" font-bold mb-2 text-white  text-[20px]">
              {company.state}
            </h1>
          </div>
          <div>
            <h3 className="text-gray-300 font-semibold text-[20px] ">City </h3>
            <h1 className=" font-bold mb-2 text-white  text-[20px]">
              {company.city}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-[30px] font-bold text-white">Company Action</h2>
          <div className="flex gap-2">
            <div
              onClick={() => handleUpdateStatus(company.id, "VERIFIED")}
              className="bg-green-600 text-white rounded-full p-2"
            >
              Accept
            </div>
            {/* Decline User Company Profile */}

            <div
              onClick={() => handleUpdateStatus(company.id, "REJECTED")}
              className="bg-red-600 text-white rounded-full p-2"
            >
              Decline
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-[30px] font-bold text-white">Description</h2>
          <p className="text-white text-[18px]">{company.description}</p>
        </div>
        <div>
          <h2 className="text-[30px] font-bold text-white">Address</h2>
          <p className="text-white text-[18px]">{company.address}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
