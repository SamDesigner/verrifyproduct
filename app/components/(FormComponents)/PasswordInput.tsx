"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
import { UseFormRegisterReturn } from "react-hook-form";
interface Props {
  placeholder?: string;
  className?: string;
  register: UseFormRegisterReturn;
  
}

export default function PasswordInput({
  placeholder = "Password",
  className = "",
  register,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full glass-input">
      <div className="w-full flex gap-3 ">
        <CiLock size={20} />
        <input
     
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          className={` pr-12 w-full outline-none ${className}`}
        />
      </div>

      {/* Eye Icon */}
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
      >
        {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
}
