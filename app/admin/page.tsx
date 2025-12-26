import Image from "next/image";
import Link from "next/link"
import properties from "@/public/images/properties.png";
const page = () => {
  return (
    <div className="bg-primary h-screen py-[100px] px-5 flex flex-col gap-10">
      <h1 className="text-white text-center text-[40px] font-semibold ">
        Temporary Admin Dashboard
      </h1>
      <div className=" grid grid-cols-3">
        <Link href='/admin/view-company'>
          <div className="bg_glass_glow w-full h-[200px] flex flex-col items-center justify-center gap-[20px] ">
            <Image className="h-[50px] w-[50px]" alt='Property Icon' src={properties} /> 
            <h3 className='text-white text-[30px]'>Company Profiles</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default page;
