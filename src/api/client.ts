import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

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
    // --- SERVER SIDE LOGIC ---
    if (IS_SERVER) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const allCookies = cookieStore.toString();

        if (allCookies && config.headers) {
          config.headers.Cookie = allCookies;
        }
      } catch (error) {
        console.log("Axios interseptor error", error);
        // Silently ignore if cookies cannot be accessed (e.g., outside of request context)
      }
    }

    // --- CLIENT SIDE LOGIC ---
    // (In the browser, axios automatically includes 'withCredentials' cookies)

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor: Handling global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("Axios response error", error);
    if (error.response?.status === 401) {
      // --- CLIENT SIDE 401 HANDLING ---
      if (!IS_SERVER) {
        console.log("[Client] Unauthorized. Cleaning up and redirecting...");
        localStorage.removeItem("user");
        // window.location.href = "/auth/login";
      }
      // --- SERVER SIDE 401 HANDLING ---
      else {
        console.log("[Server] Unauthorized request detected.");

        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          cookieStore.delete("JSESSIONID");
        } catch (e) {
          // In Server Components, we cannot delete cookies, only read them.
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
