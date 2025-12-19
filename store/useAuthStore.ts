import { create } from "zustand";
interface User {
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
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setAuth: ({ accessToken, refreshToken, user }) => {
    set({
      accessToken,
      refreshToken,
      user,
    });
    localStorage.setItem(
      "auth",
      JSON.stringify({ user, accessToken, refreshToken })
    );
  },

  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
    localStorage.removeItem("auth");
  },
}));

export const initializeAuthStore = () => {
  const stored = localStorage.getItem("auth");
  if (stored) {
    const { user, accessToken, refreshToken } = JSON.parse(stored);
    useAuthStore.getState().setAuth({ user, accessToken, refreshToken });
  }
};