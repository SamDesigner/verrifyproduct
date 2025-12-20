import { useAuthStore } from "@/store/useAuthStore";
import { toastSuccess, toastError } from "../toast/toast";

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;
  dob: string;
  profileImageUrl: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateUser(payload: UpdateUserPayload) {
  const { accessToken, setAuth, user } = useAuthStore.getState();

  if (!accessToken) {
    toastError("You must be logged in to update your profile");
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${BASE_URL}/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      toastError(data.message || "Failed to update user");
      throw new Error(data.message || "Failed to update user");
    }

  
    setAuth({
      accessToken,
      refreshToken: useAuthStore.getState().refreshToken || "",
      user: { ...user!, ...payload, id:user!.id },
      
    });

    toastSuccess("Profile updated successfully 🎉");
    return data;
  } catch (err) {
    console.error("Error updating user:", err);
    throw err;
  }
}