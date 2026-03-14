import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
const isRedirectError = (error: any): boolean => {
  return !!(
    error &&
    (error.digest?.includes("NEXT_REDIRECT") ||
      error.message === "NEXT_REDIRECT")
  );
};

const IS_SERVER = typeof window === "undefined";

const BASE_URL = IS_SERVER
  ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  : "/api";

const VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

const apiClient = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/${VERSION}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "1111",
    "X-API-Version": VERSION,
  },
});

// Request interceptor: Handling authentication and forwarding cookies
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (IS_SERVER) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const allCookies = cookieStore.toString();

        if (allCookies && config.headers) {
          config.headers.Cookie = allCookies;
        }
      } catch (error) {
        // Silently ignore if cookies cannot be accessed
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor: Handling global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (!IS_SERVER) {
        console.log("[Client] Unauthorized. Redirecting...");
        localStorage.removeItem("userGM");
        window.location.href = "/auth/login";
      } else {
        console.log("[Server] Unauthorized request detected.");
        try {
          const { redirect } = await import("next/navigation");
          redirect("/auth/login");
        } catch (e) {
          if (isRedirectError(e)) throw e;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
