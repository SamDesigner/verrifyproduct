import { useAuthStore } from "@/store/useAuthStore";
import { refreshAccessToken } from "@/lib/api/auth";

export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
) {
  const { accessToken, refreshToken} = useAuthStore.getState();

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  if (!refreshToken) {
    useAuthStore.getState().logout();
    throw new Error("Session expired");
  }

  const data = await refreshAccessToken();

  useAuthStore.setState({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  });

  // retry original request
  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${data.accessToken}`,
    },
  });
}
