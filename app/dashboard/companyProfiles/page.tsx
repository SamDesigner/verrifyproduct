"use client";

import Image from "next/image";

interface Company {
  companyId: string;
  name: string;
  city: string;
  state: string;
  companyVerificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  profileImage?: string;
}

export default function CompanyProfilesPage() {
  // Static data
  const companies: Company[] = [
    {
      companyId: "1",
      name: "Acme Corp",
      city: "Lagos",
      state: "Lagos",
      companyVerificationStatus: "VERIFIED",
      profileImage: "/images/companyImage.png",
    },
    {
      companyId: "2",
      name: "Globex Ltd",
      city: "Abuja",
      state: "FCT",
      companyVerificationStatus: "VERIFIED",
      profileImage: "/images/companyImage.png",
    },
    {
      companyId: "3",
      name: "Stark Industries",
      city: "Port Harcourt",
      state: "Rivers",
      companyVerificationStatus: "VERIFIED",
      profileImage: "/images/companyImage.png",
    },
    {
      companyId: "4",
      name: "Wayne Enterprises",
      city: "Enugu",
      state: "Enugu",
      companyVerificationStatus: "VERIFIED",
      profileImage: "/images/companyImage.png",
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">
        Company Profiles
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div
            key={company.companyId}
            className="flex bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Left Image */}
            <div className="w-1/3 relative">
              <Image
                src={company.profileImage || "/images/companyImage.png"}
                alt={company.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Right Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {company.name}
                </h2>
                <p className="text-gray-300 mt-1">
                  {company.city}, {company.state}
                </p>
                <p className="text-gray-400 mt-2">
                  Verification Status:{" "}
                  <span
                    className={`font-semibold ${
                      company.companyVerificationStatus === "VERIFIED"
                        ? "text-green-400"
                        : company.companyVerificationStatus === "PENDING"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {company.companyVerificationStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
