import Link from "next/link";
import CompanyImage from "@/public/images/companyImage.png";
import Image from 'next/image';
import MiniMap from "../components/(Map)/MiniMap";
import Button from "@/app/components/(FormComponents)/Button";
import Map from '@/public/images/map.png'
import { TbMapShare } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";
const page = () => {
  return (
    <div className="p-3">
      <div className="flex md:hidden gap-2 items-center text-white py-5">
        <span><MdDashboard size={20} /></span>
        <h1 className="text-[20px] font-semibold">Dashboard</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-gray-900 rounded-xl p-3 flex flex-col items-center gap-2">
          <Image className="h-[60px] w-[60px]" src={CompanyImage} alt='Company Image' />
          <h1 className="text-white">No Company Profile yet</h1>
          <div className="w-[200px]">
            <Link href="/create-company">
              <Button text="Create Profile" />
            </Link>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 flex flex-col items-center gap-2">
          <Image className="h-[60px] w-[60px]" src={CompanyImage} alt='Company Image' />
          <h1 className="text-white">No Company Profile yet</h1>
          <div className="w-[200px]">
            <Link href="/create-company">
              <Button text="Create Profile" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row  mt-10 gap-5">
        <div className="flex-1">
          <Link href='/dashboard/admin/view-map'>
            <div className="relative group">
              <div
                className="
                absolute inset-0
                flex flex-col items-center justify-center
                bg-black/40
                text-white font-semibold
                opacity-0
                
                transition-opacity duration-300
                group-hover:opacity-100
              "
              >
                <TbMapShare size={25} />
                <h1> View properties on map</h1>

              </div>
              <MiniMap />

            </div>
          </Link>
        </div>
        <div className="flex-1">
          <div className="bg_glass_glow text-white p-5">
            <div className="border-b border-white pb-4">
              <h3 className="text-[20px] font-bold">List of Properties</h3>
            </div>
            <div className="h-[20vh] flex flex-col gap-5 items-center justify-center">
              <Image className="h-[50px] w-[50px]" src={Map} alt="Map Image" />
              <h3 className="text-[13px]">No Property Found</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page