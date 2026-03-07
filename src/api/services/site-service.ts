import {
  Category,
  CategoryGenerationRequest,
  CreateSiteRequest,
  Region,
  Site,
  UpdateSiteRequest,
} from "@/api/types/site";
import apiClient from "@/api/client";

export const SiteService = {
  async getSites(): Promise<Site[]> {
    try {
      const response = await apiClient.get<Site[]>("/sites");
      if (response.data && response.data.length > 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.warn("Backend not available, using mock sites data", error);
      return [];
    }
  },

  async getSiteById(id: number): Promise<Site | undefined> {
    try {
      const response = await apiClient.get<Site[]>(`/sites`);
      const data = response.data.find((site) => Number(site.id) === Number(id));
      return data;
    } catch (error) {
      console.warn("Backend not available, using mock site data", error);
    }
  },

  async getRegions(siteId: number): Promise<Region[]> {
    try {
      const response = await apiClient.get<Region[]>(`/regions/site/${siteId}`);
      return response.data;
    } catch (error) {
      console.warn(
        "Backend not available, returning empty regions list",
        error,
      );
      return [];
    }
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
