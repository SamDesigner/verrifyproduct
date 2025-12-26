"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();
  const [ready, setReady] = useState(false);

  // Wait for Zustand to hydrate
  useEffect(() => {
    if (hasHydrated) {
      setReady(true);
    }
  }, [hasHydrated]);

  // Redirect if not logged in
  useEffect(() => {
    if (!ready) return;
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, ready, router]);

  // While waiting, show a loading screen
  if (!ready) return <div>Loading...</div>;

  // Render dashboard if authenticated
  if (!accessToken) return null; // redirect in useEffect handles this

  return <>{children}</>;
}
