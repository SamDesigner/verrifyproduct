// Add this to lib/api/adminVerification.ts

import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AdvanceStagePayload {
  verificationFiles?: string[];
  adminComments?: string;
}

export interface AdvanceStageResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

export async function advanceVerificationStage(
  verificationId: string,
  payload?: AdvanceStagePayload
): Promise<AdvanceStageResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/admin/verification/${verificationId}/advance-stage`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload ?? {}),
    }
  );

  const data: AdvanceStageResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to advance stage");
  }

  return data;
}