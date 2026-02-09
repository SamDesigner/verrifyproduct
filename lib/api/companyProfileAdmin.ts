import { useAuthStore } from "@/store/useAuthStore";
import { PaginatedCompanyResponse } from "@/lib/types/companyProfileAdmin";
import { VerificationStatus } from "@/lib/types/companyProfileAdmin";
import { authFetch } from "./authFetch";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllCompanies(): Promise<PaginatedCompanyResponse> {
  const { accessToken } = useAuthStore.getState(); // ✅ get token from store

  if (!accessToken) throw new Error("User not authenticated");

  const res = await authFetch(`${BASE_URL}/company/get`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch companies");
  }

  return data.data as PaginatedCompanyResponse;
}




export const updateCompanyVerificationStatus = async (
  companyId: string,
  status: VerificationStatus
) => {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(
    `${BASE_URL}/company/update/verificationStatus/${companyId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        verificationStatus: status,
        verificationMessage:"This is the message"
      }),
    }
  );

  const data = await res.json();
  console.log('This is the response while updating status', data)
  if (!res.ok) {
    throw new Error(data?.message || "Failed to update verification status");
  }

  return data;
};