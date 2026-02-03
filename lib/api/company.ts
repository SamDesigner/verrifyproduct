import {
  Company,
  CreateCompanyPayload,
  GetCompanyResponse,
  UpdateCompanyPayload,
} from "@/lib/types/company";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCompany(): Promise<Company | null> {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${BASE_URL}/company/get/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 404) {
    return null;
  }

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch company");
  }

  return data.data;
}

export async function getCompanyById(
  id: string,
): Promise<GetCompanyResponse["data"] | null> {
  const { accessToken } = useAuthStore.getState();
  const res = await fetch(`${BASE_URL}/company/get/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const response: GetCompanyResponse = await res.json();

  if (!res.ok || !response.success) {
    throw new Error(response.message || "Failed to fetch company");
  }

  return response.data;
}

export async function createCompany(payload: CreateCompanyPayload) {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${BASE_URL}/company/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("This is the response", res);
  console.log("This is the data", data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to create company profile");
  }

  return data;
}

export async function updateCompany(
  companyId: string,
  payload: UpdateCompanyPayload,
) {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    throw new Error("User not authenticated");
  }
  const res = await fetch(`${BASE_URL}/company/update/${companyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  console.log("This is the response", res);
  console.log("This is the data", data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to create company profile");
  }
}
