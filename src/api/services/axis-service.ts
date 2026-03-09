import apiClient from "@/api/client";
import { Axis } from "@/api/types/axis";

export interface UpdateAxisRequest {
  id: number;
  type: string;
  siteId: number;
  content: string;
}

export const AxisService = {
  async getAxes(): Promise<string[]> {
    try {
      const response = await apiClient.get<Axis[]>(`/axes`);
      const data = new Set(response.data.map((axis) => axis.type));
      return [...data];
    } catch (error) {
      console.warn(`Error fetching axes`, error);
      return [];
    }
  },
  async getSiteAxes(siteId: number): Promise<Axis[]> {
    try {
      const response = await apiClient.get<Axis[]>(`/axes/site/${siteId}`);
      return response.data;
    } catch (error) {
      console.warn(`Error fetching axes for site ${siteId}`, error);
      return [];
    }
  },

  async updateAxis(data: UpdateAxisRequest): Promise<Axis> {
    const response = await apiClient.put<Axis>(`/axes`, data);
    return response.data;
  },

  async createAxis(data: UpdateAxisRequest): Promise<Axis> {
    const response = await apiClient.post<Axis>(`/axes/multiple`, data);
    return response.data;
  },

  async deleteAxis(id: number): Promise<void> {
    await apiClient.delete(`/axes/${id}`);
  },
};
