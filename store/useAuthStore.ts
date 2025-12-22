import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUser } from "@/lib/api/user";
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

  setAuth: (data: {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
  }) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

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
    }),
    {
      name: "auth", 
    }
  )
);
export async function initializeUser() {
  const token = useAuthStore.getState().accessToken;
  if (!token) return;

  try {
    const user = await getCurrentUser(token);
    useAuthStore.getState().setAuth({
      accessToken: token,
      refreshToken: useAuthStore.getState().refreshToken,
      user,
    });
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    useAuthStore.getState().logout();
  }
}