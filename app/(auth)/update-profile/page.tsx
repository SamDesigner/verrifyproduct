"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateUser } from "@/lib/api/user";
import { toastError } from "@/lib/toast/toast";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/app/components/(FormComponents)/Button";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";
import authLogo from "@/public/images/authLogo.png";
import { FileUploadResponse } from "@/lib/api/file";
interface CompleteProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;

  dob?: string | null;
  profileImageUrl?: string | null;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<CompleteProfileFormData>();

  // Prefill form
  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      address: user.address ?? "",
      phoneNumber: user.phoneNumber ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      dob: user.dob ? user.dob.slice(0, 10) : undefined,
      profileImageUrl: user.profileImage ?? undefined,
    });
  }, [user, reset]);

  // Submit handler
  const onSubmit: SubmitHandler<CompleteProfileFormData> = async (data) => {
    try {
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        address: data.address,
        phoneNumber: data.phoneNumber,
        city: data.city,
        state: data.state,
        dob: data.dob ?? undefined,
        profileImageUrl: data.profileImageUrl ?? undefined,
      });

      router.push("/dashboard/profile");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Update failed");
    }
  };

  // File upload success handler
  const handleFileUploadSuccess = (file: FileUploadResponse) => {
    setValue("profileImageUrl", file.url);
  };

  return (
    <div className="max-w-xl mx-auto mt-5 md:mt-10">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center mf items-center ">
          <Image src={authLogo} alt="Logo" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-100">
          Update Profile
        </h2>
      </div>
      <form
        className="flex flex-col gap-4 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* First & Last Name */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">First Name</label>
            <input
              {...register("firstName")}
              placeholder="First Name"
              className="glass-input"
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Last Name</label>
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="glass-input"
              required
            />
          </div>
        </div>

        {/* Username & Email */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Username</label>
            <input
              {...register("username")}
              placeholder="Username"
              className="glass-input"
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Email</label>
            <input
              {...register("email")}
              disabled
              className="glass-input opacity-70"
            />
          </div>
        </div>

        {/* Phone & City */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-1  flex-col gap-2">
            <label className="text-gray-300">Phone Number</label>
            <input
              {...register("phoneNumber")}
              placeholder="Phone Number"
              className="glass-input"
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">City</label>
            <input
              {...register("city")}
              placeholder="City"
              className="glass-input"
              required
            />
          </div>
        </div>

        {/* State & DOB */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">State</label>
            <input
              {...register("state")}
              placeholder="State"
              className="glass-input"
              required
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Date of Birth</label>
            <input type="date" {...register("dob")} className="glass-input" />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300">Address</label>
          <input
            {...register("address")}
            placeholder="Address"
            className="glass-input"
            required
          />
        </div>
        {/* Profile Upload */}
        <FileUpload
          fileType="PROFILE_PICTURE"
          label="Profile Picture"
          allowedTypes={["image/jpeg", "image/png"]}
          onUploadSuccess={handleFileUploadSuccess}
        />

        <Button
          text={isSubmitting ? "Saving..." : "Save Profile"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
