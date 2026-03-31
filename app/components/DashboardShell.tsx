"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/(sidebar)/Sidebar";
import { initializeUser, useAuthStore } from "@/store/useAuthStore";
// import { FaBarsStaggered } from "react-icons/fa6";
// import Link from "next/link";
import Logo from '@/public/images/Logo.png';
import Header from "@/app/components/(Header)/Header";
// import authLogo from '@/public/images/authLogo.png';

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(false);
    const router = useRouter();
    const { accessToken, user, hasHydrated } = useAuthStore();
    const hasFetchedUser = useRef(false);

    useEffect(() => {
        if (!hasHydrated) return;

        if (!accessToken) {
            router.replace("/");
            return;
        }

        if (accessToken && !user && !hasFetchedUser.current) {
            hasFetchedUser.current = true;
            setFetchingUser(true);
            initializeUser().finally(() => setFetchingUser(false));
        }
    }, [hasHydrated, accessToken]);

    if (!hasHydrated) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
                <Image className="object-cover" src={Logo} alt="Company Logo" />
                <div className="quantum-spinner h-[30px] w-[30px]!" />
            </div>
        );
    }

    if (!accessToken) {
        return null;
    }

    if (!user && fetchingUser) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900">
                <Image className="object-cover" src={Logo} alt="Company Logo" />
                <div className="quantum-spinner h-[30px] w-[30px]!" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">

            <Header />

            <div className="flex flex-1 overflow-hidden">

                {open && (
                    <div
                        className="fixed inset-0 bg-black/50 lg:hidden z-30"
                        onClick={() => setOpen(false)}
                    />
                )}
                
                <Sidebar open={open} setOpen={setOpen} />

                <main className="flex-1 overflow-auto p-2 md:p-6 bg-gray-800  pb-[200px]!">
                    {/* <div className="flex md:hidden justify-between px-2">
                        <div>
                            <Link href='/dashboard'>
                                <Image alt="Logo" src={authLogo} />
                            </Link>
                        </div>
                        <button
                            className="lg:hidden mb-4 p-2 bg-gray-800 text-white rounded"
                            onClick={() => setOpen(true)}
                        >
                            <FaBarsStaggered size={22} />
                        </button>
                    </div> */}
                    {children}
                </main>

            </div>
        </div>
    );
}