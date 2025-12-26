"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { updateUser, UpdateUserPayload } from "@/lib/api/user";
import { toastError } from "@/lib/toast/toast";
import { FileUploadResponse } from "@/lib/api/file";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { completeProfileSchema } from "@/lib/validation/completeProfileSchema";
import Button from "@/app/components/(FormComponents)/Button";
import FileUpload from "@/app/components/(FormComponents)/FileUpload";
// import Image from "next/image";
type CompleteProfileFormData = UpdateUserPayload;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore((state) => state);
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
        dob: user.dob ? user.dob.slice(0, 10) : "",
        profileImageUrl: user.profileImage || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      await updateUser(data);
      router.push("/dashboard");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Update failed");
    }
  };
  const handleFileUploadSuccess = (fileData: FileUploadResponse) => {
    // Update the form value for profileImageUrl
    setValue("profileImageUrl", fileData.url);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-100">
        Complete Your Profile
      </h2>
      <form
        className="flex flex-col gap-4 mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <label className="text-gray-300">First Name</label>
          <input
            placeholder="First Name"
            {...register("firstName")}
            className="glass-input"
          />
          <p className="text-red-400 text-sm">{errors.firstName?.message}</p>
        </div>

        <input
          placeholder="Last Name"
          {...register("lastName")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.lastName?.message}</p>

        <input
          placeholder="Username"
          {...register("username")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.username?.message}</p>

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.email?.message}</p>

        <input
          placeholder="Phone Number"
          {...register("phoneNumber")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.phoneNumber?.message}</p>

        <input
          placeholder="Address"
          {...register("address")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.address?.message}</p>

        <input
          placeholder="City"
          {...register("city")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.city?.message}</p>

        <input
          placeholder="State"
          {...register("state")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.state?.message}</p>

        <input
          type="date"
          placeholder="Date of Birth"
          {...register("dob")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.dob?.message}</p>
        {/* {getValues("profileImageUrl") && (
          <div className="flex justify-center mb-2">
            <Image
              src={getValues("profileImageUrl")}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )} */}
        <FileUpload
          fileType="PROFILE_PICTURE"
          label="Profile Picture"
          onUploadSuccess={handleFileUploadSuccess}
          allowedTypes={["image/jpeg", "image/png"]}
        />
        <p className="text-red-400 text-sm">
          {errors.profileImageUrl?.message}
        </p>

        <Button
          text={isSubmitting ? "Saving..." : "Save Profile"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
