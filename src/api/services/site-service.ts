import {
  Category,
  CategoryGenerationRequest,
  CreateSiteRequest,
  Region,
  Site,
  UpdateSiteRequest,
  DashboardStatistics,
} from "@/api/types/site";
import apiClient from "@/api/client";
import { cache } from "react";

export const SiteService = {
  getSites: cache(async (): Promise<Site[]> => {
    const response = await apiClient.get<Site[]>("/sites");
    return response.data || [];
  }),

  getDashboardStatistics: cache(async (): Promise<DashboardStatistics> => {
    const response = await apiClient.get<DashboardStatistics>(
      "/sites/statistics/dashboard"
    );
    return response.data;
  }),

  getSiteById: cache(async (id: number): Promise<Site | null> => {
    const response = await apiClient.get<Site[]>(`/sites`);
    const site = response.data.find((site) => site.id === id);
    return site || null;
  }),

  async getRegions(siteId: number): Promise<Region[]> {
    const response = await apiClient.get<Region[]>(`/regions/site/${siteId}`);
    return response.data || [];
  },

  async createSite(data: CreateSiteRequest): Promise<Site> {
    const response = await apiClient.post<Site>("/sites/create", data);
    return response.data;
  },

  async generateCategories(
    data: CategoryGenerationRequest,
  ): Promise<Category[]> {
    const response = await apiClient.post<Category[]>("/ai/categories", data);
    return response.data;
  },

  async updateAutogenPerDay(id: string, value: number): Promise<void> {
    await apiClient.patch(`/sites/${id}/autogen-per-day`, value, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  async updateFolder(id: number, folder: string): Promise<void> {
    const response = await apiClient.patch(
      `/sites/${id}/set-folder?folderName=${folder}`,
    );
    return response.data;
  },

  async toggleAutogeneration(id: number, enabled: boolean): Promise<any> {
    const data = await apiClient.patch(`/sites/${id}/autogeneration`, enabled, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async updateSite(id: number, data: UpdateSiteRequest): Promise<Site> {
    const response = await apiClient.patch<Site>(`/sites/${id}`, data);
    return response.data;
  },
};
