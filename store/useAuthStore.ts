import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUser } from "@/lib/api/user";
import { refreshAccessToken } from "@/lib/api/auth";
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

  logout: () => void;
  refreshTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set,get) => ({
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

        const tokens = await refreshAccessToken(refreshToken);

        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        });
      },
    }),
    {
      name: "auth",
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true }); 
      },
    }
  )
);

export async function initializeUser() {
  const { accessToken, hasHydrated } = useAuthStore.getState();

  if (!hasHydrated || !accessToken) return;

  try {
    const user = await getCurrentUser(accessToken);
    useAuthStore.setState({ user });
  } catch {
    useAuthStore.getState().logout();
  }
}
