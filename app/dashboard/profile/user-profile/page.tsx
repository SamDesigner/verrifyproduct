"use client";
import { FaPen } from "react-icons/fa";
// import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from 'next/navigation'
import { useState,useEffect } from "react";
import { getCurrentUser } from "@/lib/api/user";
import type {User} from "@/store/useAuthStore"
export default function Page() {
  const [data, setData] = useState<User | null>(null);
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await getCurrentUser();
          setData(response);
          console.log("Current User Data:", response);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
  }, []);
  // const { user } = useAuthStore();
  const router = useRouter();
  // if (!user) return null;
  const profileData = [ 
    { label: "First Name", value: data?.firstName },
    { label: "Last Name", value: data?.lastName },
    { label: "Email Address", value: data?.email },
    { label: "Username", value: data?.username },
    { label: "Date of Birth", value: data?.dob },
    { label: "Phone Number", value: data?.phoneNumber },
    { label: "Address", value: data?.address },
    { label: "City", value: data?.city },
    { label: "State", value: data?.state },
  ];

  return (
    <div className="bg_glass_glow w-full p-6 flex flex-col gap-[30px]">
      <div className="flex justify-between text-white">
        <h1 className="text-[25px] font-semibold">Personal Info</h1>
        <button onClick={() => router.push('/update-profile')} className="md:border border-gray-300 rounded-xl py-1 md:px-5 cursor-pointer hover:bg-gray-100 hover:text-black transition duration-300 hover:translate-y-1 hover:shadow-2x">
          <span className="hidden md:flex">Edit Profile</span>
          <span className="md:hidden">
            <FaPen />
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
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
