"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/(sidebar)/Sidebar";
import { initializeUser, useAuthStore } from "@/store/useAuthStore";
import { FaBarsStaggered } from "react-icons/fa6";
import Link from "next/link";
// import { usePathname } from 'next/navigation'
import authLogo from '@/public/images/authLogo.png'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  // const pathname = usePathname()
  const { accessToken, user, hasHydrated } = useAuthStore();
  // const titleMap: Record<string, string> = {
  //   "/dashboard/profile/user-profile": "Personal Profile",
  //   "/dashboard/profile/company-profile": "Company Profile",
  //   "/dashboard/admin/property-management": "Property Management",
  //   "/profile": "Profile",
  //   "/dashboard": "Dashboard",
  // };
  // const title = titleMap[pathname] ?? "Page";
  useEffect(() => {
    if (!hasHydrated) return;

    // Not logged in → redirect
    if (!accessToken) {
      router.replace("/");
      return;
    }

    // Logged in but no user → fetch user
    if (accessToken && !user) {
      initializeUser();
    }
  }, [hasHydrated, accessToken, user, router]);

  // Block rendering until auth is resolved
  if (!hasHydrated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!accessToken) {
    return null; // redirect already triggered
  }

  if (!user) {
    return <div className="h-screen flex items-center justify-center">Loading user...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar open={open} setOpen={setOpen} />

      <main className="flex-1 overflow-auto p-2 md:p-6 bg-gray-800">
        <div className="flex md:hidden justify-between px-2">
          <div>
            <Link href='/dashboard'>
              <Image alt="Logo" src={authLogo} />

            </Link>
          </div>
          <button
            className="lg:hidden mb-4 p-2 bg-gray-800 text-white rounded "
            onClick={() => setOpen(true)}
          >
            <FaBarsStaggered size={22} />
          </button>
        </div>

        {/* <div className="py-6 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">{title}</h1>

        </div> */}

        {children}
      </main>
    </div>
  );
}
