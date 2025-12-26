"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthHydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setHasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    // Guarantee hydration completes on client
    useAuthStore.setState({ hasHydrated: true });
  }, []);

  return <>{children}</>;
}
