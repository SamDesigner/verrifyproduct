const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";
import { UpdateVerificationPayload } from "@/store/useUpdateVerificationStore";
import { MyRequestsResponse } from "../types/verification";
// import { InitiateVerificationPayload } from "../types/verification";
// import { VerificationDetailResponse } from "../types/verification";
export interface InitiateVerificationResponse {
  id: string;
  status: string;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
}
export interface VerificationPackagesResponse {
  success: boolean;
  message: string;
  description?: string;
  status: number;
  data: unknown; // intentionally loose until we see the real shape
}
import {
  InitiateVerificationPayload,
  VerificationDetailResponse,
} from "../types/verification";
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

// Submit A Verification Request From The User
export async function submitVerification(
  verificationId: string
): Promise<VerificationDetailResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/verification/${verificationId}/submit`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data: VerificationDetailResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to submit verification");
  }

  return data;
}

export interface MyRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: "ASC" | "DESC";
  sortBy?: string;
}

export async function getMyVerificationRequests(
  params?: MyRequestsParams
): Promise<MyRequestsResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.search) query.append("search", params.search);
  if (params?.order) query.append("order", params.order);
  if (params?.sortBy) query.append("sortBy", params.sortBy);

  const res = await authFetch(
    `${BASE_URL}/verification/my-requests?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data: MyRequestsResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch verification requests");
  }

  return data;
}

export async function getUserVerificationById(
  verificationId: string
): Promise<VerificationDetailResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/verification/${verificationId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data: VerificationDetailResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch verification details");
  }

  return data;
}


export async function updateVerification(
  verificationId: string,
  payload: UpdateVerificationPayload
): Promise<VerificationDetailResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/verification/${verificationId}/update`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data: VerificationDetailResponse = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update verification");
  return data;
}

export async function getVerificationPackages(): Promise<VerificationPackagesResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/verification-packages`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: VerificationPackagesResponse = await res.json();
  console.log("[getVerificationPackages] response:", data);
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch packages");
  }
  return data;
}