import apiClient from "@/api/client";
import { User } from "@/api/types/user";
import { cache } from "react";

export const UserService = {
  getUsers: cache(async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/users");
    return response.data || [];
  }),

  async makeAdmin(userId: number): Promise<void> {
    await apiClient.patch(`/users/${userId}/make-admin`);
  },

  async deleteUser(userId: number): Promise<any> {
    const response = await apiClient.delete(`/users/${userId}`);

    return response;
  },
};
