"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { updateUser } from "@/lib/api/user";
import { toastError } from "@/lib/toast/toast";
import { useAuthStore } from "@/store/useAuthStore";
import Button from "@/app/components/(FormComponents)/Button";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";
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

      router.push("/dashboard");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Update failed");
    }
  };

  // File upload success handler
  const handleFileUploadSuccess = (file: FileUploadResponse) => {
    setValue("profileImageUrl", file.url);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-100">
        Update Profile
      </h2>

      <form
        className="flex flex-col gap-4 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* First & Last Name */}
        <div className="flex gap-3">
          <input
            {...register("firstName")}
            placeholder="First Name"
            className="glass-input"
            required
          />
          <input
            {...register("lastName")}
            placeholder="Last Name"
            className="glass-input"
            required
          />
        </div>

        {/* Username & Email */}
        <div className="flex gap-3">
          <input
            {...register("username")}
            placeholder="Username"
            className="glass-input"
            required
          />
          <input
            {...register("email")}
            disabled
            className="glass-input opacity-70"
          />
        </div>

        {/* Phone & City */}
        <div className="flex gap-3">
          <input
            {...register("phoneNumber")}
            placeholder="Phone Number"
            className="glass-input"
            required
          />
          <input
            {...register("city")}
            placeholder="City"
            className="glass-input"
            required
          />
        </div>

        {/* State & DOB */}
        <div className="flex gap-3">
          <input
            {...register("state")}
            placeholder="State"
            className="glass-input"
            required
          />
          <input type="date" {...register("dob")} className="glass-input" />
        </div>

        {/* Address */}
        <input
          {...register("address")}
          placeholder="Address"
          className="glass-input"
          required
        />

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
