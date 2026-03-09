import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
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

const getCookie = async (name: string) => {
  if (typeof window === "undefined" && serverCookies) {
    try {
      // У Next.js 15+ cookies() повертає проміс
      const cookieStore = await serverCookies();
      return cookieStore.get(name)?.value;
    } catch (e) {
      // Якщо виклик стався на сервері, але не в контексті запиту
      return undefined;
    }
  }
  return Cookies.get(name);
};

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
  async (config: InternalAxiosRequestConfig) => {
    const token = await getCookie("go_market_token");
    console.log("Token", token);
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
    // console.log("error", error);
    // if (error.response?.status === 401) {
    //   Cookies.remove("go_market_token");
    //   localStorage.removeItem("user");
    //   window.location.href = "/auth/login";
    // }
    return Promise.reject(error);
  },
);

export default apiClient;
