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
    <div>
      <div className="flex flex-col items-center ">
        <div className="flex flex-col gap-5">
          <h2 className="text-xl text-gray-100 font-bold  text-center text-[40px]">
            Join <span className="text-purple-300">Verrify</span> where trust
            meets opportunity
          </h2>
          <p className="text-gray-100 text-center">
            Sign in to continue exploring verified land and home.
          </p>
        </div>

        {/* Signup Form Starts Here */}
        <div className="mt-5  w-full">
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-10 ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">First name</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={20} />
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
            <div className="flex gap-10 ">
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
            <div className="flex gap-10 ">
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
              <label className="text-gray-100">
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
            <Link className="font-semibold text-white" href="/login">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
