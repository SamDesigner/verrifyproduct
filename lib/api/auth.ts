const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// import { toastSuccess, toastError } from "@/lib/toast/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";
import type { User } from "@/store/useAuthStore";
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  isAgreed: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  description?: string;
  status: number;
}

interface LoginUser {
  email?: string;
  username?: string;
  password: string;
}
interface VerifyRegisterPayload {
  token: string;
  email: string;
}
interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}
interface forgetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
    };
  };
  description: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
}
export interface updatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface ResetPasswordResponse {
  success: boolean;
  message: string;
  status: number;
}
interface updatePasswordResponse {
  success: boolean;
  message: string;
  status: number;
  description?: string;
}
interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
  status: number;
  description?: string;
}

// interface logoutResponse {
//   success: boolean;
//   message: string;
//   data: string;
//   description: string;
// }

export async function registerUser(payload: RegisterPayload): Promise<unknown> {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  console.log("This is the message", data);

  if (!response.ok) {
    throw new Error(data.description.message || "Registration failed");
  }

  return data;
}

export async function loginUser(payload: LoginUser): Promise<AuthData> {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data: LoginResponse = await response.json();
  console.log("This is the Data from the login User", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message);
  }

  return data.data;
}

export async function verifyRegister(
  payload: VerifyRegisterPayload,
): Promise<unknown> {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${BASE_URL}/auth/verify/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json();
  console.log("This is the otp Data", data);

  let errorMessage = "Registration failed";
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    errorMessage = (data as { message: string }).message;
    console.log("This is the error message", errorMessage);
  }

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return data;
}

export async function verifyForgotPassword(
  payload: VerifyRegisterPayload,
): Promise<unknown> {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${BASE_URL}/auth/verify/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json();
  console.log("This is the otp Data", data);

  let errorMessage = "Registration failed";
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    errorMessage = (data as { message: string }).message;
    console.log("This is the error message", errorMessage);
  }

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return data;
}
export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data: ResetPasswordResponse = await response.json();
  console.log("This is the Data from the login User", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message);
  }

  return data;
}
export async function updatePassword(payload: updatePasswordPayload) {
  const { accessToken } = useAuthStore.getState();
  const response = await authFetch(`${BASE_URL}/user/updatePassword`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data: updatePasswordResponse = await response.json();
  console.log("This is the Data from the update Password", data);
  if (!response.ok || !data.success) {
    throw new Error(data.message);
  }

  return data;
}
export async function refreshAccessToken() {
  const { refreshToken, user } = useAuthStore.getState();

  if (!refreshToken || !user?.id) {
    throw new Error("Missing refresh token or user id");
  }
  const response = await fetch(`${BASE_URL}/auth/refresh/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, userId: user.id }),
  });
  const data: RefreshTokenResponse = await response.json();
  if (!response.ok || !data.success) {
    console.log("This is the failed response", response);
    throw new Error("Failed to refresh token");
  }

  return data.data;
}

export async function forgotPassword(
  email: string,
): Promise<forgetPasswordResponse> {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  console.log("This is the response for forgot password", response);
  const data: forgetPasswordResponse = await response.json();
  if (!response.ok || !data.success) {
    console.log("There is an error", response);
  }

  return data;
}
export async function logout() {
  try {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      console.warn("No refresh token, skipping API logout");
    } else {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn("Logout API returned:", response.status);
      }
    }
  } catch (err) {
    console.warn("Logout request failed:", err);
  } finally {
    // Always clear local state
    useAuthStore.getState().logout();
  }
}

// export async function logout(): Promise<logoutResponse> {
//   const { refreshToken } = useAuthStore.getState();
//   const response = await fetch(`${BASE_URL}/auth/logout`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ refreshToken }),
//   });
//   console.log("This is the response while logging out", response);
//   console.log('This is the refresh token', refreshToken)
//   const data: logoutResponse = await response.json();
//   if (!response.ok || !data.success) {
//     console.log("There is an error", response);
//     throw new Error(data.message || "Logout failed");
//   }
//   return data;
// }
