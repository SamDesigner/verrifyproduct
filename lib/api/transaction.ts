import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "@/lib/api/authFetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface GetMyTransactionsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export async function getMyTransactions(
  params: GetMyTransactionsParams
) {
  if (!BASE_URL) {
    throw new Error("API base URL is not defined");
  }

  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.sortBy) query.append("sortBy", params.sortBy);

  const res = await authFetch(
    `${BASE_URL}/payment/my-transactions?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return data.data;
}