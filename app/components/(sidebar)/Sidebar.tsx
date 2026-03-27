// import Logo from "@/public/images/Logo.png";
// import Image from "next/image";
"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  // Home,
  BadgeCheck,
  User,
  // Building2,
  // Warehouse,
  // Map,
  // Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";

export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["USER"],
  },
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN"],
  },
  // {
  //   label: "Property",
  //   href: "/dashboard/properties",
  //   icon: Home,
  //   roles: ["USER"],
  // },
  {
    label: "Verify Property",
    href: "/dashboard/verifyproperty",
    icon: BadgeCheck,
    roles: ["USER"],
  },

  // {
  //   label: "Company Profiles",
  //   href: "/dashboard/admin/company-profiles",
  //   icon: Building2,
  //   roles: ["SUPER_ADMIN"],
  // },
  // {
  //   label: "Company Properties",
  //   href: "/dashboard/companyproperties",
  //   icon: Building2,
  //   roles: ["USER"],
  // },
  // {
  //   label: "User Management",
  //   href: "/dashboard/admin/user-management",
  //   icon: Warehouse,
  //   roles: ["SUPER_ADMIN"],
  // },
  // {
  //   label: "Map",
  //   href: "/dashboard/admin/view-map",
  //   icon: Map,
  //   roles: ["USER", "SUPER_ADMIN"],
  // },
  // {
  //   label: "Property Management",
  //   href: "/dashboard/admin/property-management",
  //   icon: Warehouse,
  //   roles: ["SUPER_ADMIN"],
  // },
  {
    label: "Verification Requests",
    href: "/dashboard/admin/verification-request",
    icon: ShieldCheck,
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "My Requests",
    href: "/dashboard/my-requests",
    icon: ShieldCheck,
    roles: ["USER"],
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: ["USER", "SUPER_ADMIN"],
  },
  // {
  //   label: "Profile",
  //   href: "/dashboard/admin/profile",
  //   icon: User,
  //   roles: ["SUPER_ADMIN"],
  // },
  // {
  //   label: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  //   roles: ["USER", "SUPER_ADMIN"],
  // },
];

// this component is declared at module scope rather than inside Sidebar so
// it won't be recreated on every render (fixes the "cannot create components
// during render" error).

type NavLinksProps = {
  filteredLinks: typeof sidebarLinks;
  onClickLink?: () => void;
};

const NavLinks: React.FC<NavLinksProps> = ({ filteredLinks, onClickLink }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {filteredLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/dashboard" || link.href === "/dashboard/admin"
            ? pathname === "/dashboard" || pathname === "/dashboard/admin"
            : pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClickLink}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150
              ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { user } = useAuthStore();
  if (!user) return null;

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.includes(user.role)
  );

  return (
    <div>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-2000 transform flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 lg:hidden`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4 shrink-0">
          <button
            className="p-1.5 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <NavLinks filteredLinks={filteredLinks} onClickLink={() => setOpen(false)} />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full bg-gray-900 text-white overflow-hidden">
        {/* <div className="p-4 shrink-0">
          <Image src={Logo} alt="Logo" />
        </div> */}

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks filteredLinks={filteredLinks} />
        </div>
      </aside>
    </div>
  );

}