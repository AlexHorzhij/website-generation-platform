import apiClient from "@/api/client";
import { Axis, AxisTypeDataType } from "@/api/types/axis";
import { cache } from "react";

export interface UpdateAxisRequest {
  id: number;
  type: string;
  siteId: number;
  content: string;
}

export const AxisService = {
  getAxes: cache(async (): Promise<string[]> => {
    const response = await apiClient.get<Axis[]>(`/axes`);
    const data = new Set(response.data.map((axis) => axis.type));
    return [...data];
  }),

  getAxeTypes: cache(async (): Promise<AxisTypeDataType[]> => {
    const response = await apiClient.get<AxisTypeDataType[]>(`/axes/types`);
    return response.data;
  }),

  async getSiteAxes(siteId: number): Promise<Axis[]> {
    const response = await apiClient.get<Axis[]>(`/axes/site/${siteId}`);
    return response.data;
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
