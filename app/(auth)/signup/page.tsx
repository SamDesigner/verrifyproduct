"use client";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "@/lib/api/auth";
import type { InferType } from "yup";
import { useForm } from "react-hook-form";
import PasswordInput from "@/app/components/(FormComponents)/PasswordInput";
import Button from "@/app/components/(FormComponents)/Button";
import Link from "next/link";
import { signupSchema } from "@/lib/validation/signupSchema";
import Image from "next/image";
import authLogo from "@/public/images/authLogo.png";

type SignupFormData = InferType<typeof signupSchema>;
const Page = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });
  const onSubmit = async (data: SignupFormData) => {
    console.log("Sending data:", data);
    try {
      await registerUser(data);
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className=" w-full mt-[280px] md:mt-[180px]">
      <div className="flex flex-col items-center ">
        <div className="flex flex-col items-center md:items-start w-full">
          <Image className="md:hidden" src={authLogo} alt="Verrify Logo" />
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight mb-1.5">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Sign up to own a Verrify account today.
          </p>
        </div>

        {/* Signup Form Starts Here */}
        <div className=" w-full  ">
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-5 md:gap-2 w-full! ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">First name</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={15} />
                  <input
                    type="text"
                    placeholder="John"
                    {...register("firstName")}
                  />
                </div>
                <p className="text-red-400 text-sm">
                  {errors.firstName?.message}
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Surname</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={20} />
                  <input
                    type="text"
                    placeholder="Doe"
                    {...register("lastName")}
                  />
                </div>
                <p className="text-red-400 text-sm">
                  {errors.lastName?.message}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 md:gap-2 ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Email</label>
                <div className="glass-input flex gap-2">
                  <IoMailOutline className="text-white" size={20} />
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    {...register("email")}
                  />
                </div>
                <p className="text-red-400 text-sm">{errors.email?.message}</p>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Password</label>
                <PasswordInput register={register("password")} />
                <p className="text-red-400 text-sm">
                  {errors.password?.message}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 md:gap-2 ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Confirm Password</label>
                <PasswordInput register={register("confirmPassword")} />
                <p className="text-red-400 text-sm">
                  {errors.confirmPassword?.message}
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Username</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={20} />
                  <input
                    type="text"
                    placeholder="jDoe"
                    {...register("username")}
                  />
                </div>
                <p className="text-red-400 text-sm">
                  {errors.username?.message}
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center py-5">
              <input
                type="checkbox"
                className="glass-checkbox "
                {...register("isAgreed")}
              />
              <label className="text-gray-100 text-[13px]">
                I agree to Verrify’s Terms of Service and Privacy Policy.
              </label>
            </div>
            <p className="text-red-400 text-sm">{errors.isAgreed?.message}</p>
            <div>
              <Button
                text={isSubmitting ? "Signing up..." : "Sign up"}
                disabled={isSubmitting}
              />
            </div>
          </form>
          <div className="flex justify-center gap-2 pt-3 ">
            <p className="text-gray-200">Already have an account?</p>
            <Link className="font-semibold text-white underline" href="/">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
