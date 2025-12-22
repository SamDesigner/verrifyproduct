import { Company } from "@/lib/types/company"; 
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCompany() {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/api/v1/company/get/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) {
    // User does not have a company profile
    return null;
  }

  const data = await res.json();
  console.log('Response Data From Company Type Script', data)
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch company");
  }

  return data.data as Company;
}
