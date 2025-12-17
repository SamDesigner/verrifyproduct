import { IoMailOutline } from "react-icons/io5";
import PasswordInput from "@/app/components/(FormComponents)/PasswordInput";
import Button from "@/app/components/(FormComponents)/Button";
import Link from "next/link";
const page = () => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl text-gray-100 font-bold  text-center text-[40px]">
          Reset Password
        </h2>
        <p className="text-gray-100 text-center">Set up a new password</p>
      </div>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-200">First name</label>
          <div className="glass-input flex gap-2">
            <IoMailOutline className="text-white" size={20} />
            <input type="email" placeholder="john@mail.com" />
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-200">Password</label>
          <PasswordInput />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-gray-200">Confirm Password</label>
          <PasswordInput placeholder="Confirm Password" />
        </div>
        <div>
          <Button text="Reset Password" />
        </div>
      </form>
      <div className="flex justify-center items-center  mt-5 gap-2 text-gray-300">
        <span>Don&apos;t have an account?</span>
        <Link className="text-gray-100 font-semibold" href="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default page;
