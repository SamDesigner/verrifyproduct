import Logo from "@/public/images/Logo.png";
import Image from "next/image";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { HiOutlineFolderOpen } from "react-icons/hi2";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { PiWarehouseBold } from "react-icons/pi";
export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
  },
  // {
  //   label: "Portfolio",
  //   href: "/dashboard/portfolio",
  //   icon: HiOutlineFolderOpen,
  // },
  {
    label: "Properties",
    href: "/dashboard/properties",
    icon: MdOutlineMapsHomeWork,
  },
  // {
  //   label: "Reviews",
  //   href: "/dashboard/reviews",
  //   icon: PiWarehouseBold,
  // },
  // {
  //   label: "Map",
  //   href: "/dashboard/map",
  //   icon: PiWarehouseBold,
  // },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: FaUser,
  },
  {
    label: "Company Profiles",
    href: "/dashboard/companyProfiles",
    icon: PiWarehouseBold,
  }
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-40 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 lg:hidden`}
      >
        <button
          className="mb-6 p-2 bg-gray-700 rounded"
          onClick={() => setOpen(false)}
        >
          Close
        </button>

        <nav className="flex flex-col gap-3">
          <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
            Home
          </Link>
          <a
            href="/dashboard/profile"
            className="hover:bg-gray-700 p-2 rounded"
          >
            Profile
          </a>
          <a
            href="/dashboard/settings"
            className="hover:bg-gray-700 p-2 rounded"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full bg-gray-900 text-white p-4 gap-10">
        <div>
          <Image src={Logo} alt="Logo" />
        </div>

        <nav className="flex flex-col gap-3">
          {sidebarLinks.map((link, index) => {
            const Icon = link.icon
            return (
              <Link
                key={index}
                href={link.href}
                className="hover:bg-gray-700 p-2 rounded flex items-center gap-2"
              >
                <div>
                  <Icon size={25} />
                </div>
                <div>{link.label}</div>
              </Link>
            );
          })}

 
        </nav>
      </aside>
    </div>
  );
}
