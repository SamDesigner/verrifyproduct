"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/app/components/(FormComponents)/Button"
import {
  getAllCompanies,
  updateCompanyVerificationStatus,
} from "@/lib/api/companyProfileAdmin";
import { CompanySummary } from "@/lib/types/companyProfileAdmin";
import Image from "next/image";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!accessToken) return;

      try {
        const response = await getAllCompanies();
        setCompanies(response.data);
        console.log("Company Response", response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [accessToken]);

  const handleUpdateStatus = async (
    companyId: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    try {
      await updateCompanyVerificationStatus(companyId, status);

      setCompanies((prev) =>
        prev.map((c) =>
          c.companyId === companyId
            ? { ...c, companyVerificationStatus: status }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update company status");
    }
  };

  if (loading) return <p className="text-white">Loading companies...</p>;
  if (!companies.length)
    return <p className="text-white">No companies found.</p>;

  return (
    <div className="p-6 text-white bg-primary  min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center py-20">
        List of Created Company Profiles
      </h1>
      <div className="grid grid-cols-2 gap-10">
        {companies.map((c) => (
          <div
            key={c.companyId}
            className="bg-gray-800 p-4 rounded-lg flex relative h-[260px] items-center gap-3"
          >
            <div className="flex flex-col items-center gap-3 h-full">
              <Image
                src={c.profileImage || "/images/companyImage.png"}
                alt={c.name}
                width={200}
                height={200}
                className="object-cover h-full rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="">
                <p className="font-semibold text-[40px]">{c.name}</p>
                <p
                  className={`${
                    c.companyVerificationStatus === "VERIFIED"
                      ? "bg-green-900 text-white"
                      : "bg-yellow-500 text-black"
                  }  rounded-full w-fit py-1 px-3 absolute right-3 top-3`}
                >
                  {c.companyVerificationStatus}
                </p>
                <p>
                  <span>Proof Of Address: </span>
                  {c.proofOfAddressType}
                </p>
              </div>
              <div className="w-[200px]">
                  <Button text="View Profile" /> 
              </div>
              <div
                className="flex gap-2 items-center justify-between
            "
              >
                {/* Accept User Company Profile */}
                {/* <div
                  onClick={() => handleUpdateStatus(c.companyId, "VERIFIED")}
                  className="bg-green-600 text-white rounded-full p-2"
                >
                  <IoMdCheckmark />
                </div> */}
                {/* Decline User Company Profile */}

                {/* <div
                  onClick={() => handleUpdateStatus(c.companyId, "REJECTED")}
                  className="bg-red-600 text-white rounded-full p-2"
                >
                  <FaXmark />
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
