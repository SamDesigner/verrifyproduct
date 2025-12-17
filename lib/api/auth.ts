const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  isAgreed: boolean;
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

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginUser(payload: LoginUser): Promise<unknown> {
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
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
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
  let errorMessage = "Registration failed";
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    errorMessage = (data as { message: string }).message;
  }

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return data;
}
