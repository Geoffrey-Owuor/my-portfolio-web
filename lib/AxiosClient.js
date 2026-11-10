import axios from "axios";

// Create a custom instance
const apiClient = axios.create({
  baseURL: "/api", // Adjust if your API is elsewhere
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Refresh tokens rotate, so a second concurrent refresh would present the one
// the first just replaced and get the whole session revoked. Requests that fail
// together share one refresh.
let refreshPromise = null;
const refreshSession = () => {
  refreshPromise ??= axios.post("/api/refresh-token").finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await refreshSession();

        // If refresh successful, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Only a rejected session means signing in again. A network or server
        // failure is passed on, so the caller can report it and the page (and
        // whatever is being written on it) stays put.
        if (refreshError.response?.status !== 401) {
          return Promise.reject(refreshError);
        }

        console.error("Session expired, redirecting to login");
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
