import apiClient from "@/api/client";
import { LoginData, RegisterData, AuthResponse } from "@/api/types/auth";
import Cookies from "js-cookie";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/users/login", data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/users/register",
      data,
    );
    return response.data;
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post("/logout");
      localStorage.removeItem("user");
      // window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("user");
      // window.location.href = "/auth/login";
    }
  },
};
