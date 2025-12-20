"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUser, UpdateUserPayload } from "@/lib/api/user"
import { toastError } from "@/lib/toast/toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { completeProfileSchema } from "@/lib/validation/completeProfileSchema";
import Button from "@/app/components/(FormComponents)/Button";

type CompleteProfileFormData = UpdateUserPayload;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormData>({
    resolver: yupResolver(completeProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      email: user?.email || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
      city: user?.city || "",
      state: user?.state || "",
      dob: user?.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
      profileImageUrl: user?.profileImage || "",
    },
  });

  const onSubmit = async (data: CompleteProfileFormData) => {
    try {
      await updateUser(data);
      router.push("/"); // redirect to dashboard/home after completion
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Update failed");
    }
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
        <input
          placeholder="First Name"
          {...register("firstName")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.firstName?.message}</p>

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

        <input
          placeholder="Profile Image URL"
          {...register("profileImageUrl")}
          className="glass-input"
        />
        <p className="text-red-400 text-sm">{errors.profileImageUrl?.message}</p>

        <Button text={isSubmitting ? "Saving..." : "Save Profile"} disabled={isSubmitting} />
      </form>
    </div>
  );
}
