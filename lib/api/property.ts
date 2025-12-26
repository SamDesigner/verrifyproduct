const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useAuthStore } from "@/store/useAuthStore"

export interface CreatePropertyPayload {
  name: string;
  description: string;
  polygon: unknown; // Mapbox GeoJSON
  propertyType: "LAND";
  address: string;
  city: string;
  state: string;
  certificationOfOccupancy: string;
  contractOfSale: string;
  surveyPlan: string;
  letterOfIntent: string;
  isSubmitted: boolean;
}

// API call to create property
export async function createProperty(payload: CreatePropertyPayload) {
  const {accessToken}= useAuthStore.getState();
      if (!accessToken) throw new Error("User not authenticated");
  const res = await fetch(`${BASE_URL}/property`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log('This is the property Data', data)
  if (!res.ok) {
    throw new Error(data.message || "Failed to create property");
  }


  return data.data; // contains created property
}
