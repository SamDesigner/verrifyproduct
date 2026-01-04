const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useAuthStore } from "@/store/useAuthStore";
import {
  Property,
  PropertyMeta,
  GetPropertiesResponse,
  PropertyListResponse
} from "../types/property";

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
  const { accessToken } = useAuthStore.getState();
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
  console.log("This is the property Data", data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to create property");
  }

  return data.data;
}

export async function getProperties(): Promise<GetPropertiesResponse> {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");

  const res = await fetch(`${BASE_URL}/property/get`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.data) {
    throw new Error(data.message || "Failed to fetch properties");
  }
  return data.data;
}

export async function getPropertiesByViewport(params: {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom?: number;
}) {
   const { accessToken } = useAuthStore.getState();
  const query = new URLSearchParams({
    north: params.north.toString(),
    south: params.south.toString(),
    east: params.east.toString(),
    west: params.west.toString(),
    ...(params.zoom && { zoom: params.zoom.toString() }),
  });
  const res = await fetch(`${BASE_URL}/property/viewport?${query}`,{
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }});

  const data: PropertyListResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch properties by viewport");
  }

  return data.data.data; // Property[]
}

export async function getNearbyProperties(params: {
  latitude: number;
  longitude: number;
  radiusKm: number;
}) {
     const { accessToken } = useAuthStore.getState();
  const query = new URLSearchParams({
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
    radiusKm: params.radiusKm.toString(),
  });

  const res = await fetch(`${BASE_URL}/property/point?${query}`,{
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }})

  const data: PropertyListResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch nearby properties");
  }

  return data.data.data; // Property[]
}
// export async function getPropertyById(
//   propertyId: string
// ): Promise<propertyIdResponse> {
//   const { accessToken } = useAuthStore.getState();
//   if (!accessToken) throw new Error("User not authenticated");
//   const res = await fetch(`${BASE_URL}/property/${propertyId}`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   const data = await res.json();
//   if (!res.ok || !data.data) {
//     throw new Error(data.message || "Failed to fetch property");
//   }
//   return data.data;
// }
