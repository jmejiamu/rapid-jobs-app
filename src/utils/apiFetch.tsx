import { API_URL } from "@/config/api";
import { logout, setUserData } from "@/src/redux/authSlice";
import { store } from "@/src/redux/store";

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  retryOn401 = true
) => {
  const accessToken = store.getState().auth.accessToken;
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  //TODO: Change startsWith http to https once in production
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, { ...options, headers });
    if (response.status === 401 && retryOn401) {
      // Attempt refresh
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Retry the original request with the new token
        const newToken = store.getState().auth.accessToken;
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return await fetch(`${API_URL}${url}`, {
          ...options,
          headers: newHeaders,
        });
      } else {
        // Refresh failed, logout
        store.dispatch(logout());
        // Optionally navigate to login (use a navigation ref if needed)
        return;
      }
    }
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Helper to refresh token
const refreshToken = async (): Promise<boolean> => {
  const refreshToken = store.getState().auth.refreshToken;
  const deviceToken = store.getState().auth.deviceToken;
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`, // Or send refresh token if available
      },
      body: JSON.stringify({ deviceToken }),
    });
    if (response.ok) {
      const data = await response.json();
      store.dispatch(setUserData(data)); // Update Redux with new token
      return true;
    }
    return false;
  } catch (error) {
    console.error("Refresh failed:", error);
    return false;
  }
};
