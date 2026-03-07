import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

const apiClient = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, "")}/${VERSION}`,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "1111",
    "X-API-Version": VERSION,
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("go_market_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      Cookies.remove("go_market_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
