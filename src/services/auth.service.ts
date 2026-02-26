import apiClient from "@/lib/axios";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";
import Cookies from "js-cookie";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log("data", data);
    const response = await apiClient.post<AuthResponse>(
      "/api/public/users/login",
      data,
    );
    console.log("response", response);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get("/api/public/users/me");
    return response.data;
  },

  logout: () => {
    Cookies.remove("go_market_token");
    localStorage.removeItem("user");
  },
};
