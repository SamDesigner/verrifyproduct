"use client";

import Otp from "@/app/components/(FormComponents)/OtpInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toastSuccess, toastError } from "@/lib/toast/toast";
import Link from "next/link";
import Button from "@/app/components/(FormComponents)/Button";
import { verifyRegister } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/lib/types/user";
import { Suspense } from "react";
import Image from "next/image";
import authLogo from "@/public/images/authLogo.png";

const VerifyOtpContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const OTP_DURATION = 10 * 60; // 10 minutes
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
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
      const data = (await verifyRegister({ email, token: otp })) as {
        accessToken: string;
        refreshToken: string;
        user: User;
      };

      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      toastSuccess("Account verified successfully 🎉");
      router.push("/");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center items-center ">
        <Image src={authLogo} alt="Logo" />
      </div>
      <div>
        <h2 className="text-xl text-gray-100 font-bold text-center text-[40px]">
          Check Your Email
        </h2>
        <p className="text-gray-100 text-center">
          Enter the OTP that was sent to{" "}
          <span className="font-bold text-purple-300">
            {email || "your email"}
          </span>{" "}
          <br />
          {canResend ? (
            <button
              className="text-purple-300 font-semibold underline"
              onClick={() => {
                // TODO: call resend OTP API here
                setTimeLeft(OTP_DURATION);
                setCanResend(false);
              }}
            >
              Resend OTP
            </button>
          ) : (
            <span>
              Code expires in{" "}
              <span className="font-bold text-purple-300">
                {formatTime(timeLeft)}
              </span>
            </span>
          )}
        </p>
      </div>
      <Otp onChange={setOtp} value={otp} />
      <div className="flex justify-center  w-full ">
        <div className="w-[150px]">
          <Button
            onClick={handleVerify}
            text={loading ? "Verifying..." : "Verify OTP"}
          />
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <p className="text-gray-300">Don&apos;t have an account?</p>
        <Link href="/signup" className="font-semibold text-white underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};
const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
};

export default Page;
