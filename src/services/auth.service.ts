import apiClient from "@/lib/axios";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log("data", data);
    const response = await apiClient.post<AuthResponse>(
      "/api/public/users/login",
      data,
      {
        headers: {
          "X-API-Key": "1111",
        },
      },
    );
    console.log("response", response);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
