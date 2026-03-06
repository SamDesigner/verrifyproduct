const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";
import {
  VerificationListParams,
  VerificationListResponse,
  VerificationDetailResponse,
  AssignVerificationResponse,
  VerdictPayload,
  VerdictResponse,
} from "../types/verification";

export async function getVerificationList(
  params?: VerificationListParams,
): Promise<VerificationListResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const query = new URLSearchParams();
  if (params?.userId) query.append("userId", params.userId);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.order) query.append("order", params.order);
  if (params?.limit) query.append("limit", params.limit.toString());

  const res = await authFetch(
    `${BASE_URL}/admin/verification/list?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: VerificationListResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch verification list");
  }

  console.log("Verification List Response:", data);

  return data;
}

// Get Verification By ID
export async function getVerificationById(
  verificationId: string,
): Promise<VerificationDetailResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/verification/${verificationId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: VerificationDetailResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch verification details");
  }

  return data;
}

export async function assignVerification(
  verificationId: string,
): Promise<AssignVerificationResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/admin/verification/${verificationId}/assign`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: AssignVerificationResponse = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to assign verification");
  }

  return data;
}

export async function submitVerdict(
  verificationId: string,
  payload: VerdictPayload,
): Promise<VerdictResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/admin/verification/${verificationId}/verdict`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data: VerdictResponse = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to submit verdict");
  }

  return data;
}
