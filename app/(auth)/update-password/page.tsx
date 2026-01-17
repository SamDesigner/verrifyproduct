"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePassword } from "@/lib/api/auth";
import { updatePasswordSchema } from "@/lib/validation/updatePasswordSchema";
import Image from "next/image";
import PasswordInput from "@/app/components/(FormComponents)/PasswordInput";
import Button from "@/app/components/(FormComponents)/Button";
import Link from "next/link";
import { toastSuccess, toastError } from "@/lib/toast/toast";
import { useRouter } from "next/navigation";
import authLogo from "@/public/images/authLogo.png";

type updatePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<updatePasswordForm>({
    resolver: yupResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: updatePasswordForm) => {
    try {
      await updatePassword(data);
      toastSuccess("Password update successful");
      router.push("/");
    } catch (err) {
      toastError("Password update failed");
      console.error("There was an error", err);
      //   alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex  justify-center items-center ">
        <Image src={authLogo} alt="Logo" />
      </div>
      <div>
        <h2 className="text-xl text-gray-100 font-bold  text-center text-[40px]">
          Update Password
        </h2>
        <p className="text-gray-100 text-center">Set up a new password</p>
      </div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-200">Old Password</label>

          <PasswordInput register={register("oldPassword")} />

          <p className="text-red-500">{errors.oldPassword?.message}</p>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-200">New Password</label>
          <PasswordInput register={register("newPassword")} />
          <p className="text-red-500">{errors.newPassword?.message}</p>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-200">Confirm Password</label>
          <PasswordInput register={register("confirmPassword")} />
          <p className="text-red-500">{errors.confirmPassword?.message}</p>
        </div>
        <div>
          <Button
            disabled={isSubmitting}
            text={isSubmitting ? "Updating...." : "Update Password"}
          />
        </div>
      </form>
      <div className="flex justify-center items-center  mt-5 gap-2 text-gray-300">
        <span>Don&apos;t have an account?</span>
        <Link className="text-gray-100 font-semibold" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Page;
