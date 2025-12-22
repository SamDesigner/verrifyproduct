"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function Page() {
  const { user } = useAuthStore();

  if (!user) return null;

  const profileData = [
    { label: "First Name", value: user.firstName },
    { label: "Last Name", value: user.lastName },
    { label: "Email Address", value: user.email },
    { label: "Username", value: user.username },
    { label: "Date of Birth", value: user.dob },
    { label: "Phone Number", value: user.phoneNumber },
    { label: "Address", value: user.address },
    { label: "City", value: user.city },
    { label: "State", value: user.state },
  ];

  return (
    <div className="bg_glass_glow w-full p-6 flex flex-col gap-[30px]">
      <div className="flex justify-between text-white">
        <h1 className="text-[25px] font-semibold">Personal Info</h1>
        <button className="border border-gray-300 rounded-xl py-1 px-5">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[30px]">
        {profileData.map((item, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="font-semibold text-white">{item.label}</h3>
            <p className="text-gray-300 text-sm">{item.value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
