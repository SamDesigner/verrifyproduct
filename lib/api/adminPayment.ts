// Add these to lib/api/adminPayment.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";

export interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

export interface AdminTransactionsResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

export async function getAdminOrders(): Promise<AdminOrdersResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/admin/payment/orders`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: AdminOrdersResponse = await res.json();
  console.log("Admin Orders Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch admin orders");
  }

  return data;
}

export async function getAdminTransactions(): Promise<AdminTransactionsResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/admin/payment/transactions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: AdminTransactionsResponse = await res.json();
  console.log("Admin Transactions Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch admin transactions");
  }

  return data;
}