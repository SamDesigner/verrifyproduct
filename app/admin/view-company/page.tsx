"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
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
    <div className="p-6 text-white bg-primary h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center py-20">
        List of Created Company Profiles
      </h1>
      <ul className="space-y-3">
        {companies.map((c) => (
          <li
            key={c.companyId}
            className="bg-gray-800 p-4 rounded-lg flex items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={c.profileImage?.url || "/images/companyImage.png"}
                alt={c.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-gray-400">{c.companyVerificationStatus}</p>
              </div>
            </div>
            <div
              className="flex gap-2 items-center justify-between
            "
            >
              {/* Accept User Company Profile */}
              <div
                onClick={() => handleUpdateStatus(c.companyId, "VERIFIED")}
                className="bg-green-600 text-white rounded-full p-2"
              >
                <IoMdCheckmark />
              </div>
              {/* Decline User Company Profile */}

              <div
                onClick={() => handleUpdateStatus(c.companyId, "REJECTED")}
                className="bg-red-600 text-white rounded-full p-2"
              >
                <FaXmark />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
