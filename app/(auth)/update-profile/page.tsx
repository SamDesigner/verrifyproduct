"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { updateUser } from "@/lib/api/user";
import { toastError } from "@/lib/toast/toast";
import { FileUploadResponse } from "@/lib/api/file";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { completeProfileSchema } from "@/lib/validation/completeProfileSchema";
import Button from "@/app/components/(FormComponents)/Button";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";

// Define the form data type
interface CompleteProfileFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;

  // Required keys for form, optional values
  dob: string | null | undefined;
  profileImageUrl: string | null | undefined;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  console.log("This is the user", user);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormData>({
    resolver: yupResolver(completeProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        city: user.city || "",
        state: user.state || "",
        dob: user.dob ? user.dob.slice(0, 10) : null,
        profileImageUrl: user.profileImage || null,
      });
    }
  }, [user, reset]);

  // Submit handler
  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      // Map form data to API payload
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
        city: data.city,
        state: data.state,
        dob: data.dob || undefined, // optional in payload
        profileImageUrl: data.profileImageUrl || undefined, // optional in payload
      });

      router.push("/dashboard");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Update failed");
    }
  };

  // File upload success handler
  const handleFileUploadSuccess = (fileData: FileUploadResponse) => {
    setValue("profileImageUrl", fileData.url);
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
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">First Name</label>
            <input
              placeholder="First Name"
              {...register("firstName")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.firstName?.message}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Last Name</label>
            <input
              placeholder="Last Name"
              {...register("lastName")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.lastName?.message}</p>
          </div>
        </div>

        {/* Username & Email */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Username</label>
            <input
              placeholder="Username"
              {...register("username")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.username?.message}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.email?.message}</p>
          </div>
        </div>

        {/* Phone & City */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Phone Number</label>
            <input
              placeholder="Phone Number"
              {...register("phoneNumber")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">
              {errors.phoneNumber?.message}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">City</label>
            <input
              placeholder="City"
              {...register("city")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.city?.message}</p>
          </div>
        </div>

        {/* State & DOB */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">State</label>
            <input
              placeholder="State"
              {...register("state")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.state?.message}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Date of Birth</label>
            <input
              type="date"
              placeholder="Date of Birth"
              {...register("dob")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.dob?.message}</p>
          </div>
        </div>

        {/* Address & Profile Upload */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-gray-300">Address</label>
            <input
              placeholder="Address"
              {...register("address")}
              className="glass-input"
            />
            <p className="text-red-400 text-sm">{errors.address?.message}</p>
          </div>
          <div className="flex flex-1 ">
            <FileUpload
              fileType="PROFILE_PICTURE"
              label="Profile Picture"
              onUploadSuccess={handleFileUploadSuccess}
              allowedTypes={["image/jpeg", "image/png"]}
            />
            <p className="text-red-400 text-sm">
              {errors.profileImageUrl?.message}
            </p>
          </div>
        </div>

        <Button
          text={isSubmitting ? "Saving..." : "Save Profile"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
