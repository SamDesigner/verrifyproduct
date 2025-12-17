import { FiUser } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import PasswordInput from "@/app/components/(FormComponents)/PasswordInput";
import Button from "@/app/components/(FormComponents)/Button";
import Link from 'next/link'
const page = () => {
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
          <form className="flex flex-col gap-5">
            <div className="flex gap-10 ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">First name</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={20} />
                  <input type="text" placeholder="John" />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Surname</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={20} />
                  <input type="text" placeholder="Doe" />
                </div>
              </div>
            </div>
            <div className="flex gap-10 ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Email</label>
                <div className="glass-input flex gap-2">
                  <IoMailOutline className="text-white" size={20} />
                  <input type="email" placeholder="example@mail.com" />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Password</label>
                <PasswordInput />
              </div>
            </div>
            <div className="flex gap-10 ">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Confirm Password</label>
                <PasswordInput />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-200">Username</label>
                <div className="glass-input flex gap-2">
                  <FiUser className="text-white" size={20} />
                  <input type="text" placeholder="jDoe" />
                </div>
              </div>
            </div>
            <div className="flex gap-5 items-center py-5">
              <input type="checkbox" className="glass-checkbox " />
              <label className="text-gray-100">
                I agree to Verrify’s Terms of Service and Privacy Policy.
              </label>
            </div>
            <div>
              <Button text="Sign up" />
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

export default page;
