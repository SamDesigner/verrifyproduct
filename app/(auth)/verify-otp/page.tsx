"use client";
import Otp from "@/app/components/(FormComponents)/OtpInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toastSuccess, toastError } from "@/lib/toast/toast";
import Link from "next/link";
import Button from "@/app/components/(FormComponents)/Button";
import { verifyRegister } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import {User} from '@/lib/types/user'
const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth)
  const handleVerify = async () => {
    if (!email) {
      toastError("Email not found. Please sign up again.");
      return;
    }

    if (otp.length !== 6) {
      toastError("Please enter a valid OTP");
      return;
    }
 
    try {
      setLoading(true);

      const data = await verifyRegister({
        email,
        token: otp,
      }) as {
        accessToken:string,
        refreshToken:string,
        user:User
      };
      setAuth({
        accessToken:data.accessToken,
        refreshToken:data.refreshToken,
        user:data.user
      })
      toastSuccess("Account verified successfully 🎉");

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toastError(error.message);
      } else {
        toastError("OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-xl text-gray-100 font-bold text-center text-[40px]">
          Check Your Email
        </h2>
        <p className="text-gray-100 text-center">
          Enter the OTP that was sent to{" "}
          <span className="font-bold text-purple-300">{email}</span> <br /> Code
          expires in 10mins
        </p>
      </div>
      <Otp onChange={setOtp} value={otp} />
      <div className="flex justify-end w-[450px]">
        <div  className="w-[150px]">
          <Button onClick={handleVerify} text={loading ? 'Sending' : 'Send Otp'} />
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <p className="text-gray-300">Did have an account?</p>
        <Link href="/signup" className="font-semibold text-white underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Page;
