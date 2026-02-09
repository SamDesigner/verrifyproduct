import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUser } from "@/lib/api/user";
import { refreshAccessToken } from "@/lib/api/auth";
// import { getCurrentUser } from "@/lib/api/user";
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  dob: string | null;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  lastLogin: string;
  profileImage: string | null;
  is2fa: boolean;
  isVerified: boolean;
  isGoogleLogin: boolean;
  hasCompanyProfile: boolean;
  isEnabled: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  hasHydrated: boolean;

  setAuth: (data: {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
  }) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,

      setAuth: ({ accessToken, refreshToken, user }) => {
        set({ accessToken, refreshToken, user });
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },
      refreshTokens: async () => {
        const { refreshToken, user } = get();
        if (!refreshToken || !user) {
          throw new Error("No refresh token or user");
        }

        const tokens = await refreshAccessToken();

        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        });
      },
      refreshUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return null;

        try {
          const user = await getCurrentUser();
          set({ user });
          console.log('Refreshed triggered and this is the user',user)
          return user;
        } catch (error) {
          console.error("Failed to refresh user", error);
          return null;
        }
      },
    }),
    {
      name: "auth",
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);

export async function initializeUser() {
  const { accessToken, hasHydrated } = useAuthStore.getState();

  if (!hasHydrated || !accessToken) return;

  try {
    const user = await getCurrentUser();
    useAuthStore.setState({ user });
  } catch {
    useAuthStore.getState().logout();
  }
}
