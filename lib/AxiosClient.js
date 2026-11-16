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
// together share one refresh, and a Web Lock extends that across tabs: the
// tabs take turns, and a tab that waited finds the cookies already renewed.
const REFRESH_LOCK = "portfolio-refresh-token";
const REFRESHED_AT_KEY = "portfolio-refreshed-at";
// Long enough to cover tabs that failed together, far shorter than the access
// token's 15 minutes.
const FRESH_FOR_MS = 10_000;

const refreshedRecently = () => {
  try {
    const at = Number(localStorage.getItem(REFRESHED_AT_KEY));
    return Date.now() - at < FRESH_FOR_MS;
  } catch {
    return false;
  }
};

const refreshOnce = async () => {
  if (refreshedRecently()) return;
  await axios.post("/api/refresh-token");
  try {
    localStorage.setItem(REFRESHED_AT_KEY, String(Date.now()));
  } catch {}
};

let refreshPromise = null;
const refreshSession = () => {
  refreshPromise ??= (
    navigator.locks
      ? navigator.locks.request(REFRESH_LOCK, refreshOnce)
      : refreshOnce()
  ).finally(() => {
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
