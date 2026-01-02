"use client";
import Button from "@/app/components/(FormComponents)/Button";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  forgotPasswordSchema,
  ForgotPasswordForm,
} from "@/lib/validation/forgotPasswardSchema";
import { forgotPassword } from "@/lib/api/auth";
const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema),
  });
  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword(data.email);
      router.push(`/forgotpassword/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error(
        "There was an error while trying to reset password:",
        error
      );
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-xl text-gray-100 font-bold  text-center text-[40px]">
          Forgot Password
        </h2>
        <p className="text-gray-100 text-center">
          Forgotten Password? Don&apos;t Panic, we&apos;ve got you.
        </p>
      </div>
      <div className="mt-[10vh] flex flex-col gap-5">
        <h3 className="text-[23px] font-semibold text-gray-100">
          Enter Email Address
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <label className="text-gray-300">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter email"
              className="glass-input"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <Button
            disabled={isSubmitting}
            text={isSubmitting ? "Sending..." : "Reset Password"}
          />
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <p>Don&apos;t have an account?</p>
            <Link href="/signup" className="underline font-semibold">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
