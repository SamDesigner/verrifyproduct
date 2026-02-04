import Logo from "@/public/images/Logo.png";
import Image from "next/image";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
// import { HiOutlineFolderOpen } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { PiWarehouseBold } from "react-icons/pi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import { MdOutlineClose } from "react-icons/md";
export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
    roles: ["USER", "SUPER_ADMIN"],
  },
  {
    label: "Properties",
    href: "/dashboard/properties",
    icon: MdOutlineMapsHomeWork,
    roles: ["USER"],
  },

  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: FaUser,
    roles: ["USER", "SUPER_ADMIN"],
  },
  {
    label: "Company Profiles",
    href: "/dashboard/admin/company-profiles",
    icon: TbBuildingSkyscraper,
    roles: ["SUPER_ADMIN"],
  },
  // {
  //   label: "User Management",
  //   href: "/dashboard/admin/user-management",
  //   icon: PiWarehouseBold,
  //   roles: ["SUPER_ADMIN"],
  // },
  {
    label: "Map",
    href: "/dashboard/admin/view-map",
    icon: FaMapMarkedAlt,
    roles: ["USER","SUPER_ADMIN"],
  },
  {
    label: "Property Management",
    href: "/dashboard/admin/property-management",
    icon: PiWarehouseBold,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: CiSettings,
    roles: ["USER", "SUPER_ADMIN"],
  },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  if (!user) return null;
  return (
    <div>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-40 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 lg:hidden`}
      >
        <button
          className="mb-6 p-2"
          onClick={() => setOpen(false)}
        >
          <MdOutlineClose size={22} />
        </button>

        <nav className="flex flex-col gap-3">
          {sidebarLinks
            .filter((link) => link.roles.includes(user.role))
            .map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition
                  ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"}
                `}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      {/* <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full bg-gray-900 text-white p-4 gap-10">
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
      </aside> */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full bg-gray-900 text-white p-4 gap-10">
        <div>
          <Image src={Logo} alt="Logo" />
        </div>
        <nav className="flex flex-col gap-3">
          {sidebarLinks
            .filter((link) => link.roles.includes(user.role))
            .map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition
                  ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-800"}
                `}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
        </nav>
      </aside>
    </div>
  );
}
