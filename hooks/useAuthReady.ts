"use client";

import { useAuthStore } from "@/store/useAuthStore";

export function useAuthReady() {
    const hasHydrated = useAuthStore((state) => state.hasHydrated);
    const accessToken = useAuthStore((state) => state.accessToken);

    const isReady = hasHydrated && !!accessToken;

    return { isReady, hasHydrated, accessToken };
}