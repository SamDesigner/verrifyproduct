"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/(sidebar)/Sidebar";
import { initializeUser, useAuthStore } from "@/store/useAuthStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { accessToken, user, hasHydrated } = useAuthStore();

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

      <main className="flex-1 overflow-auto p-6 bg-gray-800">
        <button
          className="lg:hidden mb-4 p-2 bg-gray-800 text-white rounded"
          onClick={() => setOpen(true)}
        >
          Open Menu
        </button>
        {children}
      </main>
    </div>
  );
}
