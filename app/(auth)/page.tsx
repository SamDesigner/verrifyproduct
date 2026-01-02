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
type LoginFormData = InferType<typeof loginSchema>;
export default function LoginPage() {
  const router = useRouter();
  // const setAuth = useAuthStore((state) => state.setAuth);
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
      const {user } = res;
      console.log("This is res", res);
      toastSuccess("Login successful 🎉");
      if (user.role === "USER") {
        router.push("/dashboard");
      }else{
        router.push("/dashboard/admin")
      }
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Login failed");
    }
  };
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center ">
        <h2 className="text-xl text-gray-100 font-bold  text-[40px]">
          Welcome Back To <span>Verrify</span>
        </h2>
        <p className="text-gray-100">
          Login in to continue exploring verified land and home.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="glass-input flex items-center gap-3 ">
          <FiUser className="text-white" size={20} />
          <input
            className="w-full outline-none "
            type="email"
            placeholder="Email"
            {...register("email")}
          />
        </div>
        <p className="text-red-400 text-sm">{errors.email?.message}</p>
        <div>
          <PasswordInput register={register("password")} />
          <p className="text-red-400 text-sm">{errors.password?.message}</p>
        </div>
        <div className="flex justify-end text-gray-300">
          <Link href="/forgotpassword" className="hover:underline">
            Forgot Password
          </Link>
        </div>
        <Button
          text={isSubmitting ? "Logging in..." : "Login"}
          disabled={isSubmitting}
        />
      </form>
      <div className="flex justify-center gap-2 pt-3 ">
        <p className="text-gray-200">Don&apos;t have an account?</p>
        <Link className="font-semibold text-white" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
