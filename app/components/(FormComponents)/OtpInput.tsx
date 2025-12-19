"use client";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import Button from "@/app/components/(FormComponents)/Button";
interface OtpComponentProps {
  value: string;
  onChange: (otp: string) => void;
}
export default function OtpComponent({value,onChange}:OtpComponentProps) {

  return (
    <div className="flex flex-col items-center gap-4">
      <OTPInput
        value={value}
        onChange={onChange}
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
  

      {/* <button className="py-2 px-4 bg-blue-600 text-white rounded">
        Verify
      </button> */}
    </div>
  );
}
