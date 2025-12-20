const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { toastSuccess, toastError } from "@/lib/toast/toast";
import { useAuthStore } from "@/store/useAuthStore";
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
  toastSuccess(data.message || "Account Success");
  if (!response.ok) {
    toastError(data.description.message || "Registration failed");
    throw new Error(data.description.message || "Registration failed");
  }

  return data;
}

export async function loginUser(payload: LoginUser):Promise<AuthData> {
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
  console.log('This is the Data from the login User',data)
  if (!response.ok || !data.success) {
    toastError(data.message || "Login failed");
    throw new Error(data.message);
  }
  const { accessToken, refreshToken, user } = data.data;
   useAuthStore.getState().setAuth({
    accessToken,
    refreshToken,
    user,
  });
  toastSuccess("Login successful");
  return {accessToken, refreshToken, user};
}

export async function verifyRegister(
  payload: VerifyRegisterPayload
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

export async function refreshAccessToken() {
  const { refreshToken, accessToken, user, setAuth, logout } =
    useAuthStore.getState();
  if (!refreshToken || !user) return;
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      console.log("This is the failed response", response);
      throw new Error("Failed to refresh token");
    }
    const data:{refreshToken: string} = await response.json();
    setAuth({
      accessToken,
      refreshToken: data.refreshToken,
      user,
    });

    return data.refreshToken;
  } catch (err) {
    logout();
    console.log("There is an error", err);
    return null;
  }
}
