const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// import { toastSuccess, toastError } from "@/lib/toast/toast";
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

  if (!response.ok) {

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
    throw new Error(data.message);
  }

  return data.data;
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

export async function refreshAccessToken(refreshToken:string) {

    const response = await fetch(`${BASE_URL}/auth/refresh/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) {
      console.log("This is the failed response", response);
      throw new Error("Failed to refresh token");
    }

   
 return response.json() as Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  
  
}
