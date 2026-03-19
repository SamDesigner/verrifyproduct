const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "./authFetch";

// ── Types ──────────────────────────────────────────────────────────────────

export interface InitializePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paystackDetails: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
    order: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
    propertyVerification: unknown;
  };
  description?: string;
  status: number;
}
export interface GetOrderResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

export interface MyOrdersResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

export interface MyTransactionsResponse {
  success: boolean;
  message: string;
  data: unknown;
  description?: string;
  status: number;
}

// ── API Functions ──────────────────────────────────────────────────────────

export async function initializeVerificationPayment(
  verificationId: string,
): Promise<InitializePaymentResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/payment/initialize/verification/${verificationId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: InitializePaymentResponse = await res.json();
  console.log("Initialize Payment Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return data;
}

export async function getMyOrders(): Promise<MyOrdersResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/payment/my-orders`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: MyOrdersResponse = await res.json();
  console.log("My Orders Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
}
export async function getVerificationOrder(
  verificationId: string,
): Promise<GetOrderResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(
    `${BASE_URL}/payment/order/verification/${verificationId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data: GetOrderResponse = await res.json();
  console.log("Get Verification Order Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch verification order");
  }

  return data;
}

export async function getMyTransactions(): Promise<MyTransactionsResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/payment/my-transactions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: MyTransactionsResponse = await res.json();
  console.log("My Transactions Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return data;
}
