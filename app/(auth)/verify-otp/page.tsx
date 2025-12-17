import Otp from "@/app/components/(FormComponents)/OtpInput";
import Link from  'next/link'
const page = () => {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-xl text-gray-100 font-bold  text-center text-[40px]">
          Check Your Email
        </h2>
        <p className="text-gray-100 text-center">
          Enter the OTP that was sent to{" "}
          <span className="font-bold text-purple-300">youremail@gmail.com</span>{" "}
          <br /> Code expires in 10mins
        </p>
      </div>
      <Otp />
      <div className="flex gap-2 items-center justify-center">
        <p className="text-gray-300">Did have an account?</p>
        <Link href='/signup' className='font-semibold text-white underline'>Sign up</Link>
      </div>
    </div>
  );
};

export default page;
