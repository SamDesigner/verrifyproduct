// app/(auth)/page.tsx
import { FiUser } from "react-icons/fi";
import Link from 'next/link'
import PasswordInput from "../components/(FormComponents)/PasswordInput";
import Button from '../components/(FormComponents)/Button'
export default function LoginPage() {
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

      <form className="flex flex-col gap-5">
        <div className="glass-input flex items-center gap-3 ">
          <FiUser className='text-white' size={20} />
          <input className="w-full outline-none " type="email" placeholder="Email" />
        </div>
        <div>
          <PasswordInput  />
        </div>
        <div className="flex justify-end text-gray-300">
          <Link href='/forgotpassword' className="hover:underline">Forgot Password</Link>
        </div>
        <Button text="Log in" />
 

      
      </form>
      <div className="flex justify-center gap-2 pt-3 ">
          <p className="text-gray-200">Don&apos;t have an account?</p>
          <Link className="font-semibold text-white" href='/signup'>Sign up</Link>
      </div>
    </div>
  );
}
