// app/(auth)/page.tsx
"use client";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { toastSuccess, toastError } from "@/lib/toast/toast";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/validation/loginSchema";
import type { InferType } from "yup";
import { useForm } from "react-hook-form";
import PasswordInput from "../components/(FormComponents)/PasswordInput";
import Button from "../components/(FormComponents)/Button";
import authLogo from '@/public/images/authLogo.png'
import Image from "next/image";

type LoginFormData = InferType<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginUser(data);
      setAuth({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: res.user,
      });
      toastSuccess("Login successful 🎉");
      if (res.user.role === "USER") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Login failed";
      toastError(message);
    }
  };

  return (
    <div className="w-full md:w-3/4">



      {/* Title */}
      <div className="flex flex-col items-center md:items-start">
        <Image className="md:hidden" src={authLogo} alt="Verrify Logo" />
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-1.5">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Sign in to your Verrify account to continue.
        </p>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Email address
          </label>
          <div
            className="flex items-center gap-3 h-12 px-4 rounded-xl transition-all duration-200 focus-within:border-indigo-500/50 focus-within:bg-indigo-500/[0.04]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <FiUser className="text-slate-600 shrink-0" size={15} />
            <input
              className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder-slate-700"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
          </div>
          {errors.email?.message && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Password
          </label>
          <PasswordInput register={register("password")} />
          {errors.password?.message && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <Link
            href="/forgotpassword"
            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors duration-150"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <div className="mt-1">
          <Button
            text={isSubmitting ? "Signing in..." : "Sign in"}
            disabled={isSubmitting}
          />
        </div>
      </form>

    </div>





  );
}