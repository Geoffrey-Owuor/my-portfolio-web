import axios from "axios";

// Create a custom instance
const apiClient = axios.create({
  baseURL: "/api", // Adjust if your API is elsewhere
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

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
        await axios.post("/api/refresh-token");

        // If refresh successful, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails (token expired/invalid), redirect to login
        console.error("Session expired, redirecting to login");
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
