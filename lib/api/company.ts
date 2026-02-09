import {
  Company,
  CreateCompanyPayload,
  GetCompanyResponse,
  UpdateCompanyPayload,
} from "@/lib/types/company";
import { useAuthStore } from "@/store/useAuthStore";
import { authFetch } from "@/lib/api/authFetch";
import { useCompanyStore } from "@/store/useCompanyStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCompany(): Promise<Company | null> {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  const res = await authFetch(`${BASE_URL}/company/get/user`, {
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
  const res = await authFetch(`${BASE_URL}/company/get/${id}`, {
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

  const res = await authFetch(`${BASE_URL}/company/create`, {
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
  const res = await authFetch(`${BASE_URL}/company/update/${companyId}`, {
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
export async function getCompanyProperties(){
  const { accessToken } = useAuthStore.getState();
  const { companyId } = useCompanyStore.getState();
  if (!accessToken) {
    throw new Error("User not authenticated");
  }
  if (!companyId) {
    throw new Error("User does not have a company profile");
  }
  const res = await authFetch(`${BASE_URL}/property/company/${companyId}`, {
    method: "GET",
    headers: {  
          "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const response = await res.json();
  console.log("This is the response", response);
  if (!res.ok || !response.success) {
    throw new Error(response.message || "Failed to fetch company properties");
  }
  return response.data
}
// export async function getCompanyProperties():Promise<Company> {
//   const { accessToken } = useAuthStore.getState();
//   const { companyId } = useCompanyStore.getState();
//   if (!accessToken) {
//     throw new Error("User not authenticated");
//   }
//   if (!companyId) {
//     throw new Error("User does not have a company profile");
//   }

//   const res = await authFetch(`${BASE_URL}/property/company/${companyId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   const response = await res.json();
//   console.log("This is the response", res);
//   console.log("This is the data", response);
//   if (!res.ok || !response.success) {
//     throw new Error(response.message || "Failed to fetch company properties");
//   }

//   return response.data.data as Property[];

// }
