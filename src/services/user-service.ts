import apiClient from "@/lib/axios";
import { User } from "@/types/user";

export const UserService = {
  async getUsers(): Promise<User[]> {
    // Включаємо мокані дані для тестування, поки бекенд не працює
    const mockUsers: User[] = [
      {
        id: 1,
        username: "admin_user",
        email: "admin@gomarket.com",
        passwordHash: "*****",
        role: "ADMIN",
        createdAt: "2024-02-25T14:30:00Z",
        site: "Main Marketplace",
      },
      {
        id: 2,
        username: "ivan_test",
        email: "ivan@example.com",
        passwordHash: "*****",
        role: "USER",
        createdAt: "2024-02-25T15:45:00Z",
        site: "Tech Hub",
      },
      {
        id: 3,
        username: "maria_manager",
        email: "maria@business.com",
        passwordHash: "*****",
        role: "USER",
        createdAt: "2024-02-24T10:15:00Z",
        site: "Global Sales",
      },
    ];

    try {
      const response = await apiClient.get<User[]>("/admin/v1/users", {
        headers: {
          "X-API-Key": "1111",
        },
      });
      return response.data;
    } catch (error) {
      console.warn("Backend not available, using mock user data", error);
      return mockUsers;
    }
  },
};
