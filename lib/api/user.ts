import { useAuthStore } from "@/store/useAuthStore";
import {  toastError } from "../toast/toast";

import type {User} from "@/store/useAuthStore"
// export interface UpdateUserPayload {
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   address: string;
//   phoneNumber: string;
//   city: string;
//   state: string;
//   dob?: string | null | undefined;
//   profileImageUrl?: string | null | undefined;
// }
export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;
  dob?: string;
  profileImageUrl?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getCurrentUser(token: string): Promise<User> {
  if (!BASE_URL) throw new Error("API base URL is not defined");

  const response = await fetch(`${BASE_URL}/api/v1/user/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // auth header required
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    toastError(data.message || "Failed to fetch user");
    throw new Error(data.message || "Failed to fetch user");
  }

  return data.data; // this is your User object
}
// lib/api/user/index.ts



export async function updateUser(payload: UpdateUserPayload) {
  const { accessToken } = useAuthStore.getState();

  const res = await fetch(`${BASE_URL}/user/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log('This is the response from the API',data)
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.data;
}
