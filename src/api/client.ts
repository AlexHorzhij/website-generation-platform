import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
const BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    : "/api";
const VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

let serverCookies: any;
if (typeof window === "undefined") {
  try {
    const { cookies } = require("next/headers");
    serverCookies = cookies;
  } catch (e) {
    // Ігноруємо помилку, якщо ми не в середовищі Next.js
  }
}

const apiClient = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/${VERSION}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "1111",
    "X-API-Version": VERSION,
  },
});

// Request interceptor for handle cookies & headers
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Forward cookies on the server side (Next.js server components/actions)
    if (typeof window === "undefined" && serverCookies) {
      try {
        const cookieStore = await serverCookies();
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
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.log("error", error);
    if (error.response?.status === 401) {
      // Cookies.remove("JSESSIONID");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
