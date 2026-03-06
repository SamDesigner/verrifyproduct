import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "@/lib/api/authFetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function initializeVerificationPayment(
  verificationId: string
) {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  const res = await authFetch(
    `${BASE_URL}/payment/initialize/verification/${verificationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return data.data;
}


// My Transaction API

