import apiClient from "@/api/client";
import { LoginData, RegisterData, AuthResponse } from "@/api/types/auth";
import Cookies from "js-cookie";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log("data", data);
    const response = await apiClient.post<AuthResponse>(
      "/public/users/login",
      data,
    );
    console.log("response", response);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/public/users/register",
      data,
    );
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
