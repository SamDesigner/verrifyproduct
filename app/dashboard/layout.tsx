"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/(sidebar)/Sidebar";
import { initializeUser, useAuthStore } from "@/store/useAuthStore";
import { toastError } from "@/lib/toast/toast";
import { useRouter } from "next/navigation";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { accessToken, user } = useAuthStore();
  const router = useRouter()
  useEffect(() => {
    const hydrateUser = async () => {
        if (!accessToken) {
        router.push("/");
        return;
      }
      if (!user) {
        try {
          await initializeUser();
        } catch (err) {
          toastError(err instanceof Error ? err.message : "Failed to load user");
          router.push("/");
          return;
        }
      }
      setLoading(false); 
    };

    hydrateUser();
  }, [accessToken, user,router]);
  // Loader when data is fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading user data...
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gray-800">
        {/* Mobile toggle button */}
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
