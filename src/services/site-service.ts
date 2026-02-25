import { Site } from "@/types/site";
import { Listing } from "@/types/listing";
import apiClient from "@/lib/axios";

export const SiteService = {
  async getSites(): Promise<Site[]> {
    const response = await apiClient.get<Site[]>("/admin/v1/sites", {
      headers: {
        "X-API-Key": "1111",
      },
    });
    console.log("response 1getSites11", response);
    return response.data;
  },

  async getSiteById(id: string): Promise<Site | undefined> {
    // Якщо бекенд підтримує отримання одного сайту за id:
    const response = await apiClient.get<Site>(`/admin/v1/sites/${id}`, {
      headers: {
        "X-API-Key": "1111",
      },
    });
    return response.data;
  },

  async getListingsBySiteId(siteId: string): Promise<Listing[]> {
    const response = await apiClient.get<Listing[]>(
      `/api/listings/site/${siteId}`,
      {
        headers: {
          "X-API-Key": "1111",
        },
      },
    );
    return response.data;
  },
};
// /api/adimn / regions / site / { siteId };
