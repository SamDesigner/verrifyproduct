"use client";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import Button from "@/app/components/(FormComponents)/Button";

export default function OtpComponent() {
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        inputType="number"
        containerStyle="gap-2"
        inputStyle={{}}
        renderSeparator={<span>--</span>}
        renderInput={(props) => (
          <input
            {...props}
            style={{}}
            className="w-12 h-12 border border-white rounded text-center text-purple-300!  "
          />
        )}
      />
      <div className="flex justify-end w-[450px]">
        <div className="w-[150px]">
          <Button text="Resend" />
        </div>
      </div>

      {/* <button className="py-2 px-4 bg-blue-600 text-white rounded">
        Verify
      </button> */}
    </div>
  );
}
