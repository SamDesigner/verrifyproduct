"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import CoverPhoto from "@/public/images/coverPhoto.png";
import AvatarImage from "@/public/images/avatar.png";
import VerifyUser from "@/public/images/verifyUser.png";
import Link from "next/link";
import Button from "@/app/components/(FormComponents)/Button";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const pathname = usePathname();

  if (!user) {
    return <p className="text-white text-center mt-10">Loading user data...</p>;
  }

  const profileSrc = user.profileImage || AvatarImage;

  const isPersonal = pathname.includes("/profile/user-profile");
  const isCompany = pathname.includes("/profile/company-profile");

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
            <Link href="dashboard/profile/user-profile">
              <Button text="Personal Profile" type={isPersonal ? "" : "bordered"} />
              {/* <Button
                text="Personal Profile"
                type={isPersonal ? "primary" : "bordered"}
              /> */}
            </Link>

            <Link href="/dashboard/profile/company">
              <Button text="Company Profile" type={isCompany ? "" : "bordered"} />

              {/* <Button
                text="Company Profile"
                type={isCompany ? "primary" : "bordered"}
              /> */}
            </Link>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
