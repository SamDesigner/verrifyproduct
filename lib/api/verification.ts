const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";
import { InitiateVerificationPayload } from "../types/verification";

export interface InitiateVerificationResponse {
  id: string;
  status: string;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
}

// 🔹 Initiate Verification
export async function initiateVerification(
  payload: InitiateVerificationPayload
) {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/verification/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to initiate verification");
  }

  return data.data;
}