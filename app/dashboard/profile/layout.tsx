"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import CoverPhoto from "@/public/images/coverPhoto.png";
import AvatarImage from "@/public/images/avatar.png";
import VerifyUser from "@/public/images/verifyUser.png";

import Button from "@/app/components/(FormComponents)/Button";
import { useRouter, usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isPersonal = pathname === "/dashboard/profile/user-profile";
  const isCompany = pathname === "/dashboard/profile/company-profile";

  if (!user) {
    return <p className="text-white text-center mt-10">Loading user data...</p>;
  }

  const profileSrc = user.profileImage || AvatarImage;

  return (
    <div className="bg-gray-900 w-full p-5 flex flex-col gap-[50px]">
      {/* Cover */}
      <Image
        className="h-[40vh] w-full object-cover"
        src={CoverPhoto}
        alt="Cover Photo"
      />

      {/* Header */}
      <div className="flex">
        <div className="w-[20%]">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src={profileSrc}
              alt="Profile Picture"
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>

        <div className="w-[80%] flex flex-col gap-2.5">
          <h1 className="text-[30px] text-white font-semibold">
            {user.firstName} {user.lastName}
          </h1>

          <div className="flex gap-2 items-center text-white">
            <Image src={VerifyUser} alt="Verified User" className="w-5 h-5" />
            Verrify User
          </div>

          {/* Tabs */}
          <div className="flex gap-10 w-[500px]">
            <Button
              text="Personal Profile"
              type={isPersonal ? "" : "bordered"}
              onClick={() => router.push("/dashboard/profile/user-profile")}
            />

            <Button
              text="Company Profile"
              onClick={() => router.push("/dashboard/profile/company-profile")}
              type={isCompany ? "" : "bordered"}
            />
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
