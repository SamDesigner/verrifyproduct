"use client";

import { useState } from "react";
import Sidebar from "../components/(sidebar)/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

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
