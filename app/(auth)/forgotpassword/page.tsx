import Button from '@/app/components/(FormComponents)/Button'
import Link from 'next/link';
const page = () => {
  return (
    <div>
      <div>
        <h2 className="text-xl text-gray-100 font-bold  text-center text-[40px]">
          Forgot Password
        </h2>
        <p className="text-gray-100 text-center">
          Forgotten Password? Don&apos;t Panic, we&apos;ve got you.
        </p>
      </div>
      <div className='mt-[10vh] flex flex-col gap-5'>
        <h3 className="text-[23px] font-semibold text-gray-100">
          Enter Email Address
        </h3>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-3'>
            <label className="text-gray-300">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              className="glass-input"
            />
          </div>
            <Button text='Send Code' />
            <div className='flex items-center justify-center gap-2 text-gray-300'>
                <p>Don&apos;t have an account?</p>
                <Link href='/signup' className='underline font-semibold'>Sign up</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default page;
