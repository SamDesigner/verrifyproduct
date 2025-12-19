"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { user } = useAuthStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
    }
  }, [setAuth]);
  return <>{children}</>; // just an example
}
