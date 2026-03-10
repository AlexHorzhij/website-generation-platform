import apiClient from "@/api/client";
import { User } from "@/api/types/user";

export const UserService = {
  async getUsers(): Promise<User[]> {
    // Включаємо мокані дані для тестування, поки бекенд не працює

    try {
      const response = await apiClient.get<User[]>("/users");
      return response.data;
    } catch (error) {
      console.warn("Backend not available, using mock user data", error);
      return [];
    }
  },

  async makeAdmin(userId: number): Promise<void> {
    await apiClient.patch(`/users/${userId}/make-admin`);
  },

  async deleteUser(userId: number): Promise<any> {
    const response = await apiClient.delete(`/users/${userId}`);

    console.log("response delete user", response);
    return response;
  },
};
