const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { useAuthStore } from "@/store/useAuthStore";

export interface FileUploadResponse {
  fileId: string;
  url: string;
}

export async function uploadFile(
  file: File,
  fileInfo: string
): Promise<FileUploadResponse> {
  if (!BASE_URL) throw new Error("API base URL is not defined");
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) throw new Error("User not authenticated");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileInfo", fileInfo);

  const response = await fetch(`${BASE_URL}/file/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log('Upload Response',data)

  if (!response.ok || !data.success) {
    throw new Error(data.message || "File upload failed");
  }

  return data.data; // This contains fileId and url
}
